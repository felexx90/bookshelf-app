// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type { BooksResponse } from "../../../interfaces/Books";
import { transformBooksResponse } from "../../../utils/booksHelper";

type Error = {
  error?: string;
  description?: string;
};

type Response = BooksResponse | Error;

export const getBooks = async (
  query?: string | Record<string, string> | string[][]
) => {
  const result = await fetch(
    `${process.env.NEXT_BOOKS_BASE_URL}/books?${new URLSearchParams(query)}`
  );
  const data = await result.json();
  return transformBooksResponse(data);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "GET") {
      try {
      // @ts-ignore
      const books = await getBooks(req.query);
      res.status(200).json(books);
    } catch (e) {
      res.status(500).json({ error: "Unable to fetch", description: e });
    }
  } else {
    res
      .status(500)
      .json({ error: "Unable to fetch", description: "Method not supported" });
  }
}
