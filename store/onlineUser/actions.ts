import { OnlineUserInterface, OnlineUserListInterface } from "./model";
import {
  UPDATE_LIST,
  ADD_ONLINE_USER,
  REMOVE_ONLINE_USER,
} from "./types";

export const updateOnlineUserList = (payload: OnlineUserListInterface) => ({
  type: UPDATE_LIST,
  payload,
});

export const addOnlineUser = (payload: OnlineUserInterface) => ({
  type: ADD_ONLINE_USER,
  payload,
});

export const removeOnlineUser = (payload: OnlineUserInterface) => ({
  type: REMOVE_ONLINE_USER,
  payload,
});
