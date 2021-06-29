export interface NewsItemReducerInterface {
  id: string;
  title: string;
  description: string;
  image?: string;
  created_at: Date;
}

export interface NewsReducerInterface {
  loadingList: boolean;
  list: NewsItemReducerInterface[];
}
