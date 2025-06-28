import { bookApi } from '@/api/ApiClient';
import { BookResponse, BookResponseCollectionEnum } from '@/api/generated';
import { useCallback, useEffect, useState } from 'react';

export const useBooks = (collection?: BookResponseCollectionEnum) => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookApi.getAllBooks();
      let filteredBooks = response.data;
      if (collection) {
        filteredBooks = response.data.filter(book => book.collection === collection);
      }
      filteredBooks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setBooks(filteredBooks);
    } catch (e) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
};
