export interface MessageItemReducerInterface {
  id: number;
  conversationId: number;
  senderId: string;
  receiverId: string;
  text: string;
  sentTime: Date;
}

export interface ConversationItemReducerInterface {
  id: number;
  userIdA: string;
  userIdB: string;
  messages: MessageItemReducerInterface[];
}

export interface ConversationReducerInterface {
  loadingList: boolean;
  conversationIdIndex: {};
  list: ConversationItemReducerInterface[];
}
