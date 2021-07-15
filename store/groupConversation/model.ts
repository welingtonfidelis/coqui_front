export interface MessageItemReducerInterface {
  id: number;
  senderId: string;
  groupId: string;
  text: string;
  sentTime: Date;
}

export interface ConversationGroupItemReducerInterface {
  id: string;
  messages: MessageItemReducerInterface[];
}

export interface ConversationGroupStartListReducerInterface {
  loadingList: boolean;
  list: ConversationGroupItemReducerInterface[];
}

export interface ConversationGroupReducerInterface {
  loadingList: boolean;
  list: {};
  countNewMessages: number;
}
