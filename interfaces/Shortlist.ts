export type Shortlist = {
  userId: string;
  list: {
    id: number;
    title: string;
    subjects: string[];
    booking: { beginDate: Date; endDate: Date };
  }[];
};

export type ShortlistResponse = {
  data: Shortlist;
  error?: string;
};
