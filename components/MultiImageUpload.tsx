'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  type: 'books' | 'deals';
  label?: string;
  maxImages?: number;
  maxSizeMB?: number;
}

export default function MultiImageUpload({
  values,
  onChange,
  type,
  label = 'Images',
  maxImages = 5,
  maxSizeMB = 5,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed max
    if (values.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('All files must be images');
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        toast.error(`Each file must be less than ${maxSizeMB}MB`);
        return;
      }
    }

    // Upload files
    try {
      setUploading(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seller/upload/${type}/multiple`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      // Add new URLs to existing ones
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const newUrls = data.data.map((img: any) => `${baseUrl.replace('/api', '')}${img.url}`);
      onChange([...values, ...newUrls]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleClick = () => {
    if (values.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({values.length}/{maxImages})
      </label>

      <div className="space-y-3">
        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Existing Images */}
          {values.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200?text=Invalid';
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Upload Button */}
          {values.length < maxImages && (
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                  <span className="text-xs text-gray-600">Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-600 font-medium">Add Image</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Helper text */}
        <p className="text-xs text-gray-500">
          Upload up to {maxImages} images. PNG, JPG, WebP or GIF (max {maxSizeMB}MB each).
          Images will be automatically optimized.
        </p>
      </div>
    </div>
  );
}
