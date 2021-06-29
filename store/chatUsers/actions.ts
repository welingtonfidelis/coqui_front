import {
  ChatUserItemReducerInterface,
  ChatUsersReducerInterface,
} from "./model";
import {
  INSERT_NEW_CHAT_USER,
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

export const chatUsersInsertOldMessages = (
  payload: ChatUserItemReducerInterface
) => ({
  type: INSERT_NEW_CHAT_USER,
  payload,
});
