import { BookRequest, BookRequestCollectionEnum } from '@/api/generated';

export interface ISBNBook {
  title?: string;
  authors?: string[];
  publisher?: string;
  publishedDate?: string;
  description?: string;
  industryIdentifiers?: {
    type: string;
    identifier: string;
  }[];
  language?: string;
}

class ISBNService {
  /**
   * Fetch book information by ISBN using Google Books API
   */
  async getBookByISBN(isbn: string): Promise<BookRequest | null> {
    try {
      // Remove any hyphens from the ISBN
      const cleanISBN = isbn.replace(/-/g, '');
      
      // Use Google Books API to fetch book data
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanISBN}`);
      const data = await response.json();
      
      if (data.totalItems === 0 || !data.items || data.items.length === 0) {
        console.log('No books found for ISBN:', cleanISBN);
        return null;
      }
      
      const bookInfo = data.items[0].volumeInfo;
      
      // Map the Google Books API response to our BookRequest model
      const bookRequest: BookRequest = {
        title: bookInfo.title || '',
        author: bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown',
        language: bookInfo.language || 'en',
        isbn: cleanISBN,
        collection: BookRequestCollectionEnum.Library
      };
      
      return bookRequest;
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      return null;
    }
  }
}

export const isbnService = new ISBNService();
