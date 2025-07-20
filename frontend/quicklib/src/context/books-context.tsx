import { BooksFilter, useBooksApi } from '@/hooks/use-books-api';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface BooksContextValue extends ReturnType<typeof useBooksApi> {
  filter: BooksFilter;
  setFilter: (filter: BooksFilter) => void;
  resetFilters: () => void;
}

const BooksContext = createContext<BooksContextValue | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<BooksFilter>({});
  const booksHook = useBooksApi();

  const resetFilters = useCallback(() => {
    setFilter({});
  }, []);
  
  const value = useMemo(() => ({ 
    ...booksHook, 
    filter, 
    setFilter, 
    resetFilters 
  }), [booksHook, filter, resetFilters]);
  
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export const useBooksContext = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooksContext must be used within a BooksProvider');
  return ctx;
};
