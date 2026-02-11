// API fetcher functions for SSR
import { Book, Genre, Author, fetchAllBooks as fetchAllBooksAPI, fetchFeaturedBooks as fetchFeaturedBooksAPI, fetchBestsellers as fetchBestsellersAPI, fetchNewArrivals as fetchNewArrivalsAPI, fetchGenres as fetchGenresAPI, fetchBooksByGenre as fetchBooksByGenreAPI, fetchBooksByAuthor as fetchBooksByAuthorAPI, fetchBookById as fetchBookByIdAPI, searchBooks as searchBooksAPI, fetchBestsellingAuthors as fetchBestsellingAuthorsAPI } from '@/services/bookService'

export const fetchFeaturedBooks = async (): Promise<Book[]> => {
  return await fetchFeaturedBooksAPI()
}

export const fetchBestsellers = async (): Promise<Book[]> => {
  return await fetchBestsellersAPI()
}

export const fetchNewArrivals = async (): Promise<Book[]> => {
  return await fetchNewArrivalsAPI()
}

export const fetchAllBooks = async (): Promise<Book[]> => {
  return await fetchAllBooksAPI()
}

export const fetchGenres = async (): Promise<Genre[]> => {
  return await fetchGenresAPI()
}

export const fetchBooksByGenre = async (genreSlug: string): Promise<Book[]> => {
  return await fetchBooksByGenreAPI(genreSlug)
}

export const fetchBooksByAuthor = async (authorId: string): Promise<Book[]> => {
  return await fetchBooksByAuthorAPI(authorId)
}

export const fetchBookById = async (id: string): Promise<Book | null> => {
  return await fetchBookByIdAPI(id)
}

export const searchBooks = async (query: string): Promise<Book[]> => {
  return await searchBooksAPI(query)
}

export const fetchBestsellingAuthors = async (): Promise<Author[]> => {
  return await fetchBestsellingAuthorsAPI()
}