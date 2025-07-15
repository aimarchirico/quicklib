import { bookApi } from '@/api/ApiClient';
import { BookRequest, BookResponse, BookResponseCollectionEnum } from '@/api/generated';
import { getAuth, onAuthStateChanged } from '@/config/firebase';
import { useCallback, useEffect, useState } from 'react';

export interface BooksFilter {
  collection?: BookResponseCollectionEnum;
  author?: string;
  series?: string;
  language?: string;
}

// Helper function to retry API calls on 502 errors
const retryOnBadGateway = async <T>(
  apiCall: () => Promise<T>,
  operationName: string,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (e: any) {
      const isRetryableError = e.response?.status === 502;
      const isLastAttempt = attempt === maxRetries;
      
      if (isRetryableError && !isLastAttempt) {
        // Wait before retrying with exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying ${operationName} after ${delay}ms (attempt ${attempt + 2}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If it's not retryable or this is the last attempt, throw the error
      throw e;
    }
  }
  throw new Error('Unexpected end of retry loop');
};

// Utility function to convert empty strings to null in BookRequest
const cleanBookData = (data: BookRequest): BookRequest => {
  const cleanedData = { ...data };
  Object.keys(cleanedData).forEach((key) => {
    const typedKey = key as keyof BookRequest;
    if (typeof cleanedData[typedKey] === 'string' && cleanedData[typedKey] === '') {
      (cleanedData[typedKey] as any) = null;
    }
  });
  
  // If series is null or empty string, set sequenceNumber to null
  if (!cleanedData.series) {
    cleanedData.sequenceNumber = undefined;
  }
  
  return cleanedData;
};

export const useBooks = () => {
  const [books, setBooks] = useState<BookResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Listen to auth state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed in useBooks:', currentUser ? 'User logged in' : 'No user');
      setUser(currentUser);
      setAuthInitialized(true);
    });
    return unsubscribe;
  }, []);

  // Fetch all books (no filtering on API level)
  const fetchAll = useCallback(
    async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await retryOnBadGateway(
          () => (bookApi.getAllBooks()),
          'fetchAll'
        );
        let fetchedBooks = response.data;
        // Sort by creation date (newest first)
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
    [],
  );

  // Fetch a single book by id
  const fetch = useCallback(
    async (id: number) => {
      const localBook = books.find(book => book.id === id);
      if (localBook) {
        return localBook;
      }
      return null;
    },
    [books],
  );

  // Add a new book
  const add = useCallback(
    async (data: BookRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await retryOnBadGateway(
          () => bookApi.addBook(cleanBookData(data)),
          'add'
        );
        await fetchAll();
        return response.data;
      } catch (e: any) {
        setError(e.message || 'Error adding book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll],
  );

  // Update a book
  const update = useCallback(
    async (id: number, data: BookRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await retryOnBadGateway(
          () => bookApi.updateBook(id, cleanBookData(data)),
          'update'
        );
        await fetchAll();
        return response.data;
      } catch (e: any) {
        setError(e.message || 'Error updating book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll],
  );

  // Delete a book
  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await retryOnBadGateway(
          () => bookApi.deleteBook(id),
          'remove'
        );
        await fetchAll();
      } catch (e: any) {
        setError(e.message || 'Error deleting book');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [fetchAll],
  );

  // Initial fetch - only when user is authenticated
  useEffect(() => {
    if (authInitialized && user) {
      console.log('Auth initialized and user present, fetching books');
      fetchAll();
    } else if (authInitialized && !user) {
      console.log('Auth initialized but no user, resetting books state');
      setBooks([]);
      setLoading(false);
      setError(null);
    }
  }, [authInitialized, user, fetchAll]);

  return { books, loading, error, refetch: fetchAll, fetchAll, fetch, add, update, remove };
};
