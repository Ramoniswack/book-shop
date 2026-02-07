import { BookDetailSkeleton } from '@/components/LoadingSkeleton'
import MainLayout from '@/layouts/MainLayout'

export default function Loading() {
  return (
    <MainLayout>
      <BookDetailSkeleton />
    </MainLayout>
  )
}