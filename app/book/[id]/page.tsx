import { notFound } from 'next/navigation'
import Image from 'next/image'
import MainLayout from '@/layouts/MainLayout'
import BookDetailClient from '@/components/BookDetailClient'
import { fetchBookById } from '@/utils/fetcher'

interface BookPageProps {
  params: {
    id: string
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const book = await fetchBookById(params.id)
  
  if (!book) {
    notFound()
  }

  return (
    <MainLayout>
      <BookDetailClient book={book} />
    </MainLayout>
  )
}