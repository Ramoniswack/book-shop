'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface SEOSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  allowIndexing: boolean
  customSitemapUrls: string[]
  customDisallowedPaths: string[]
  socialImage: string
  twitterHandle: string
}

export default function SEOPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<SEOSettings>({
    siteName: 'BookStore Nepal',
    siteDescription: "Nepal's largest online bookstore with over 35,000 books",
    siteUrl: 'https://bookstore.com',
    allowIndexing: true,
    customSitemapUrls: [],
    customDisallowedPaths: [],
    socialImage: '',
    twitterHandle: '',
  })
  const [saving, setSaving] = useState(false)
  const [newUrl, setNewUrl] = useState('')
  const [newPath, setNewPath] = useState('')

  useEffect(() => {
    checkAuthorization()
  }, [])

  const checkAuthorization = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Decode token to check role
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userRole = payload.role

      if (userRole !== 'seller' && userRole !== 'admin') {
        toast.error('Access denied. Seller or Admin access required.')
        router.push('/')
        return
      }

      setIsAuthorized(true)
      await fetchSettings()
    } catch (error) {
      console.error('Authorization error:', error)
      router.push('/login')
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/seo/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success('SEO settings updated successfully')
      } else {
        toast.error(data.message || 'Failed to update settings')
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const addCustomUrl = () => {
    if (newUrl && !settings.customSitemapUrls.includes(newUrl)) {
      setSettings({
        ...settings,
        customSitemapUrls: [...settings.customSitemapUrls, newUrl],
      })
      setNewUrl('')
    }
  }

  const removeCustomUrl = (url: string) => {
    setSettings({
      ...settings,
      customSitemapUrls: settings.customSitemapUrls.filter(u => u !== url),
    })
  }

  const addDisallowedPath = () => {
    if (newPath && !settings.customDisallowedPaths.includes(newPath)) {
      setSettings({
        ...settings,
        customDisallowedPaths: [...settings.customDisallowedPaths, newPath],
      })
      setNewPath('')
    }
  }

  const removeDisallowedPath = (path: string) => {
    setSettings({
      ...settings,
      customDisallowedPaths: settings.customDisallowedPaths.filter(p => p !== path),
    })
  }

  if (!isAuthorized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                SEO Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage search engine optimization and indexing settings
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          {/* Site Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Site Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Site URL
                </label>
                <input
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Indexing Control */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Indexing Control
            </h2>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.allowIndexing}
                onChange={(e) => setSettings({ ...settings, allowIndexing: e.target.checked })}
                className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Allow search engines to index this site
              </span>
            </label>
          </div>

          {/* Social Media */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Social Media
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Social Image URL
                </label>
                <input
                  type="url"
                  value={settings.socialImage}
                  onChange={(e) => setSettings({ ...settings, socialImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter Handle
                </label>
                <input
                  type="text"
                  value={settings.twitterHandle}
                  onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                  placeholder="@bookstorenepal"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Custom Sitemap URLs */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Custom Sitemap URLs
            </h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="/custom-page"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addCustomUrl}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {settings.customSitemapUrls.map((url) => (
                <div key={url} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{url}</span>
                  <button
                    onClick={() => removeCustomUrl(url)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Disallowed Paths */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Custom Disallowed Paths (robots.txt)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Add paths to block from search engine crawling. Critical paths like /, /books, /deals are protected.
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPath}
                onChange={(e) => setNewPath(e.target.value)}
                placeholder="/admin"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={addDisallowedPath}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {settings.customDisallowedPaths.map((path) => (
                <div key={path} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{path}</span>
                  <button
                    onClick={() => removeDisallowedPath(path)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h2>
            <div className="flex gap-4">
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/sitemap.xml`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 text-sm"
              >
                View Sitemap
              </a>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}/robots.txt`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 hover:text-orange-600 text-sm"
              >
                View Robots.txt
              </a>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
