import {
  ChatUserItemReducerInterface,
  ChatUsersReducerInterface,
  RemoveChatUserReducerInterface,
} from "./model";
import {
  INSERT_CHAT_USER,
  REMOVE_CHAT_USER,
  START_LIST_LOAD,
  STOP_LIST_LOAD,
  UPDATE_LIST,
} from "./types";

export const chatUsersStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const chatUsersStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const chatUsersUpdateList = (payload: ChatUsersReducerInterface) => ({
  type: UPDATE_LIST,
  payload,
});

export const removeChatUser = (payload: RemoveChatUserReducerInterface) => ({
  type: REMOVE_CHAT_USER,
  payload
});

export const addChatUser = (payload: ChatUserItemReducerInterface) => ({
  type: INSERT_CHAT_USER,
  payload
});


