import { HYDRATE } from "next-redux-wrapper";
import {
  ChatUserItemReducerInterface,
  ChatUsersReducerInterface,
  ChatUsersStartListReducerInterface,
} from "./model";
import {
  INSERT_NEW_CHAT_USER,
  START_LIST_LOAD,
  STOP_LIST_LOAD,
  UPDATE_LIST,
} from "./types";

const initialState: ChatUsersReducerInterface = {
  loadingList: false,
  list: {},
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
      const chatUsers: ChatUsersStartListReducerInterface = action.payload;

      const list = {};
      chatUsers.list.forEach((item, index) => {
        list[item.id] = item;
      });

      return {
        ...state,
        ...chatUsers,
        list,
      };
    }

    case INSERT_NEW_CHAT_USER: {
      const newChatUser: ChatUserItemReducerInterface = action.payload;

      if (newChatUser) {
        return {
          ...state,
          list: {
            ...state.list,
            [newChatUser.id]: newChatUser,
          },
        };
      }
    }

    default: {
      return state;
    }
  }
};

export default reducer;
