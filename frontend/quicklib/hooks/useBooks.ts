import { bookApi } from '@/api/ApiClient';
import { BookRequest, BookResponse, BookResponseCollectionEnum } from '@/api/generated';
import { useCallback, useEffect, useState } from 'react';

export interface BooksFilter {
  collection?: BookResponseCollectionEnum;
  author?: string;
  series?: string;
  language?: string;
}

export const useBooks = (filters?: BooksFilter) => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all books (with optional filters)
  const fetchAll = useCallback(
    async (customFilters?: BooksFilter) => {
      try {
        setLoading(true);
        setError(null);
        const response = await bookApi.getAllBooks();
        let fetchedBooks = response.data;
        const f = customFilters || filters;
        if (f) {
          if (f.collection) {
            fetchedBooks = fetchedBooks.filter(book => book.collection === f.collection);
          }
          if (f.author) {
            fetchedBooks = fetchedBooks.filter(book => book.author === f.author);
          }
          if (f.series) {
            fetchedBooks = fetchedBooks.filter(book => book.series === f.series);
          }
          if (f.language) {
            fetchedBooks = fetchedBooks.filter(book => book.language === f.language);
          }
        }
        fetchedBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setBooks(fetchedBooks);
        return fetchedBooks;
      } catch (e: any) {
        setError(e.message || 'Error loading books');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  // Fetch a single book by id
  const fetch = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookApi.getBookById(id);
        return response.data;
      } catch (e: any) {
        setError(e.message || 'Error loading book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Add a new book
  const add = useCallback(
    async (data: BookRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookApi.addBook(data);
        return response.data;
      } catch (e: any) {
        setError(e.message || 'Error adding book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update a book
  const update = useCallback(
    async (id: number, data: BookRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookApi.updateBook(id, data);
        return response.data;
      } catch (e: any) {
        setError(e.message || 'Error updating book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial fetch
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { books, loading, error, refetch: fetchAll, fetchAll, fetch, add, update };
};
