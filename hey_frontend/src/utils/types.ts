export type Note = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  updatedAt: number;
  createdAt: number;
};

export type SortMode = 'updated' | 'title';
