export interface MessageItemReducerInterface {
  id: number;
  conversationId: number;
  fromUserId: string;
  toUserId: string;
  text: string;
  sentTime: Date;
}

export interface ConversationItemReducerInterface {
  id: number;
  userIdA: string;
  userIdB: string;
  messages: MessageItemReducerInterface[];
  hasMoreMessages: boolean;
  pageMessages: number;
  loadingMoreMessages: boolean;
  newMessage: boolean;
  createdAt: Date;
}

export interface ConversationStartListReducerInterface {
  loadingList: boolean;
  list: ConversationItemReducerInterface[];
}

export interface ConversationReducerInterface {
  loadingList: boolean;
  list: {};
  countNewMessages: number;
}
