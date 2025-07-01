import { BooksFilter, useBooks } from '@/hooks/useBooks';
import React, { createContext, useContext, useMemo, useState } from 'react';

interface BooksContextValue extends ReturnType<typeof useBooks> {
  filter: BooksFilter;
  setFilter: (filter: BooksFilter) => void;
}

const BooksContext = createContext<BooksContextValue | undefined>(undefined);

export const BooksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filter, setFilter] = useState<BooksFilter>({});
  const booksHook = useBooks(filter);
  const value = useMemo(() => ({ ...booksHook, filter, setFilter }), [booksHook, filter]);
  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};

export const useBooksContext = () => {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error('useBooksContext must be used within a BooksProvider');
  return ctx;
};
