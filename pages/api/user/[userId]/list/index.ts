import type { NextApiRequest, NextApiResponse } from "next";
import type { ShortlistResponse } from "@/interfaces/Shortlist";
import dbConnect from "@/lib/dbConnect";
import Shortlist from "@/models/Shortlist";

type Error = {
  error?: string;
  description?: string;
};

type Response = ShortlistResponse | Error;

export const addBook = async (
  query: Partial<{
    [key: string]: string | string[];
  }>,
  body: any
) => {
  await dbConnect();
  const { userId } = query;
  const { id, title, subjects, authors, image } = body;
  const book = {
    id,
    title,
    subjects,

    image,
  };
  // @ts-ignore
  const shortlist = await Shortlist.findByUser(userId);
  if (shortlist) {
    shortlist.list.push(book);
    await shortlist.save();
  } else {
    const newShortlist = new Shortlist({
      userId,
      list: [book],
    });
    await newShortlist.save();
  }
  return shortlist;
};

// delete a book from the shortlist
export const deleteBook = async (
  query: Partial<{
    [key: string]: string | string[];
  }>,
  body: any
) => {
  await dbConnect();
  const { userId } = query;
  const { id } = body;
  // @ts-ignore
  const shortlist = await Shortlist.findByUser(userId);
  if (shortlist) {
    shortlist.list = shortlist.list.filter((book) => book.id !== id);
    await shortlist.save();
  }
  return shortlist;
};

export const getShortlist = async (
  query: Partial<{
    [key: string]: string | string[];
  }>
) => {
  await dbConnect();
  const { userId } = query;
  // @ts-ignore
  const shortlist = await Shortlist.findByUser(userId);

  return shortlist;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  switch (req.method) {
    case "GET":
      try {
        const books = await getShortlist(req.query);
        res.status(200).json(books);
      } catch (e) {
        res.status(500).json({ error: "Unable to fetch", description: e });
      }
      break;
    case "PUT":
      try {
        const books = await addBook(req.query, req.body);
        res.status(200).json(books);
      } catch (e) {
        res.status(500).json({ error: "Unable to fetch", description: e });
      }
      break;
    case "DELETE":
      try {
        const books = await deleteBook(req.query, req.body);
        res.status(200).json(books);
      } catch (e) {
        res.status(500).json({ error: "Unable to fetch", description: e });
      }
      break;
    default:
      res.status(500).json({
        error: "Unable to fetch",
        description: "Method not supported",
      });
      break;
  }
}
