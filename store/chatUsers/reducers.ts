import { HYDRATE } from "next-redux-wrapper";
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

const initialState: ChatUsersReducerInterface = {
  loadingList: false,
  chatUserIdIndex: {},
  list: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return { ...state, ...action.payload.cashregister };
    }

    case START_LIST_LOAD: {
      const newState = { ...state, loadingList: true };

      return newState;
    }

    case STOP_LIST_LOAD: {
      const newState = { ...state, loadingList: false };

      return newState;
    }

    case UPDATE_LIST: {
      const conversations: ChatUsersReducerInterface = action.payload;
      const chatUserIdIndex = {};

      conversations.list.forEach((item, index) => {
        chatUserIdIndex[item.id] = index;
      });
      const newState = { ...state, ...conversations, chatUserIdIndex };

      return newState;
    }

    case INSERT_NEW_CHAT_USER: {
      const newChatUser: ChatUserItemReducerInterface = action.payload;
      const newState = state;

      if (newChatUser) {
        newState.chatUserIdIndex[newChatUser.id] = newState.list.length;
        newState.list.push(newChatUser);
      }

      return newState;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
