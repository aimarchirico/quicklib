import { bookApi } from '@/api/ApiClient';
import { BookResponse, BookResponseCollectionEnum } from '@/api/generated';
import { useCallback, useEffect, useState } from 'react';

export const useBooks = (collection?: BookResponseCollectionEnum) => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = useCallback(async () => {
    console.log("Fetching books with collection:", collection);
    try {
      setLoading(true);
      console.log("About to call bookApi.getAllBooks()");
      const response = await bookApi.getAllBooks();
      console.log("Books fetched successfully:", response.data);
      let filteredBooks = response.data;
      if (collection) {
        filteredBooks = response.data.filter(book => book.collection === collection);
      }
      filteredBooks.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setBooks(filteredBooks);
    } catch (e: any) {
      console.error("Error fetching books:", e);
      setError(e.message || "Unknown error fetching books");
    } finally {
      setLoading(false);
    }
  }, [collection]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return { books, loading, error, refetch: fetchBooks };
};
