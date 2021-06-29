export interface ChatUserItemReducerInterface {
  id: string;
  name: string;
  profileImage: string;
}

export interface ChatUsersReducerInterface {
  loadingList: boolean;
  chatUserIdIndex: {};
  list: ChatUserItemReducerInterface[];
}
