export interface NewsItemReducerInterface {
  id: string;
  title: string;
  description: string;
  expiresIn: Date;
  createdAt: Date;
}
export interface NewsListReducerInterface {
  loadingList: boolean;
  list: NewsItemReducerInterface[];
}
