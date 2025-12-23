export interface Category {
  id: string;
  name: string;
}

export interface Startup {
  name: string;
  foundedYear: number;
  categoryId: string;
  website: string;
  linkedin?: string;
}

export type SortOrder = 'asc' | 'desc';
