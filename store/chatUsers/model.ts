export interface ChatUserItemReducerInterface {
  id: string;
  name: string;
  profileImage: string;
}

export interface ChatUsersStartListReducerInterface {
  loadingList: boolean;
  list: ChatUserItemReducerInterface[];
}

export interface RemoveChatUserReducerInterface {
  id: string;
}

export interface ChatUsersReducerInterface {
  loadingList: boolean;
  list: {};
}
