export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export interface NewsState {
  news: NewsItem[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  keyword: string;
}

export type NewsKeyword = "꿀벌" | "수정벌";

export interface NewsHookReturn extends NewsState {
  setKeyword: (keyword: NewsKeyword) => void;
  setCurrentPage: (page: number) => void;
  refresh: () => void;
  currentItems: NewsItem[];
  totalPages: number;
}
