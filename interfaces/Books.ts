export type Book = {
  id: number;
  title: string;
  subjects: string[];
  authors: {
    birth_year: number | null;
    death_year: number | null;
    name: string;
  }[];
  bookshelves: string[];
  languages: string[];
  image: string;
  copyright: boolean;
  media_type: string;
  downloads: number;
  formats: { [key: string]: string }[];
  dowload_count: number;
};

export type BooksApiResponse = {
  count: number;
  next: string;
  previous: string;
  results: Book[];
};

export type BooksResponse = {
  count: number;
  next: number;
  previous: number;
  results: Book[];
};