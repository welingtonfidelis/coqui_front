import {
  ConversationReducerInterface,
  ConversationStartListReducerInterface,
  MessageItemReducerInterface,
} from "./model";
import {
  INSERT_NEW_CONVERSATION,
  INSERT_NEW_MESSAGE,
  INSERT_OLD_MESSAGES,
  START_LIST_LOAD,
  STOP_LIST_LOAD,
  UPDATE_ID,
  UPDATE_LIST,
} from "./types";

export const conversationStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const conversationStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const conversationUpdateList = (payload: {
  conversationList: ConversationStartListReducerInterface;
  userId: string;
}) => ({
  type: UPDATE_LIST,
  payload,
});

export const conversationUpdateId = (payload: {
  receiverId: string;
  conversationId: string;
}) => ({
  type: UPDATE_ID,
  payload,
});

export const conversationInsertOldMessages = (payload: {
  messageList: MessageItemReducerInterface[];
  userId: string;
}) => ({
  type: INSERT_OLD_MESSAGES,
  payload,
});

export const conversationInsertNewMessages = (payload: {
  message: MessageItemReducerInterface;
  userId: string;
}) => ({
  type: INSERT_NEW_MESSAGE,
  payload,
});
