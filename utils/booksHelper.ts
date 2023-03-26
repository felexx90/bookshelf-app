import type { BooksApiResponse, BooksResponse } from "../interfaces/Books";

export const transformBooksResponse = (response: BooksApiResponse) => {
  const { count, next, previous, results } = response;
  const newNext = next ? parseInt(next.split("=")[1]) : 0;
  const newPrevious = previous ? parseInt(previous.split("=")[1]) : 0;
  const newResults = results.map((book) => {
    const { formats, ...rest } = book;
    return {
      ...rest,
      formats,
      image: formats["image/jpeg"],
    };
  });

  return {
    count,
    next: newNext,
    previous: newPrevious,
    results: newResults,
  } as BooksResponse;
};
