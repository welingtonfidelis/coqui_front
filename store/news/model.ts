export interface NewsItemReducerInterface {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: Date;
}
export interface NewsListReducerInterface {
  loadingList: boolean;
  list: NewsItemReducerInterface[];
}
