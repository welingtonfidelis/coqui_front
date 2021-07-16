export interface NewsItemReducerInterface {
  id: string;
  title: string;
  description: string;
  expiresIn: Date;
  createdAt: Date;

  loadingItemAction: boolean;
}
export interface NewsListReducerInterface {
  loadingList: boolean;
  loadingSave: boolean;
  list: NewsItemReducerInterface[];
}
