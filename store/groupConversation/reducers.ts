import { HYDRATE } from "next-redux-wrapper";
import {
  ConversationGroupItemReducerInterface,
  ConversationGroupReducerInterface,
  ConversationGroupStartListReducerInterface,
  MessageItemReducerInterface,
} from "./model";
import {
  INSERT_NEW_CONVERSATION,
  INSERT_NEW_MESSAGE,
  INSERT_OLD_MESSAGES,
  START_LIST_LOAD,
  STOP_LIST_LOAD,
  UPDATE_LIST,
} from "./types";

const initialState: ConversationGroupReducerInterface = {
  loadingList: false,
  list: {},
  countNewMessages: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return { ...state, ...action.payload };
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
      const conversations: ConversationGroupStartListReducerInterface =
        action.payload.list;
      let countNewMessages = 0;

      const list = {};
      conversations.list.forEach((item, index) => {
        list[item.id] = item;
      });

      return {
        ...state,
        countNewMessages,
        list,
      };
    }

    case INSERT_OLD_MESSAGES: {
      const oldMessages: MessageItemReducerInterface[] =
        action.payload.list;
      const id = action.payload.id;

      if (oldMessages.length) {

        return {
          ...state,
          list: {
            ...state.list,
            [id]: {
              ...state.list[id],
              messages: [...oldMessages, ...state.list[id].messages],
            },
          },
        };
      }
    }

    case INSERT_NEW_MESSAGE: {
      const newMessage: MessageItemReducerInterface = action.payload.message;
      const id = action.payload.id;
      const userId = action.payload.userId;

      let countNewMessages = state.countNewMessages + 1;

      if (newMessage.senderId === userId) countNewMessages = 0;

      if (!state.list[id]) {
        return {
          ...state,
          countNewMessages,
          list: {
            ...state.list,
            [id]: {
              id,
              messages: [newMessage],
            },
          },
        };
      }

      return {
        ...state,
        countNewMessages,
        list: {
          ...state.list,
          [id]: {
            ...state.list[id],
            messages: [...state.list[id].messages, newMessage],
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
