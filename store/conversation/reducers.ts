import { HYDRATE } from "next-redux-wrapper";
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
  UPDATE_LIST,
} from "./types";

const initialState: ConversationReducerInterface = {
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
      const conversations: ConversationStartListReducerInterface =
        action.payload.conversationList;
      const userId = action.payload.userId;

      const list = {}
      conversations.list.forEach((item, index) => {
        const receiverId =
          item.userIdA !== userId ? item.userIdA : item.userIdB;

        list[receiverId] = item;
      });
      return { 
        ...state, 
        ...conversations, 
        list
      };
    }

    case INSERT_OLD_MESSAGES: {
      const oldMessages: MessageItemReducerInterface[] =
        action.payload.messageList;
      const userId = action.payload.userId;

      if (oldMessages.length) {
        const receiverId =
          oldMessages[0].receiverId !== userId
            ? oldMessages[0].receiverId
            : oldMessages[0].senderId;

        return {
          ...state,
          list: {
            ...state.list,
            [receiverId]: {
              ...state.list[receiverId],
              messages: [...oldMessages, ...state.list[receiverId].messages],
            },
          },
        };
      }
    }

    case INSERT_NEW_MESSAGE: {
      const newMessage: MessageItemReducerInterface = action.payload.message;
      const userId = action.payload.userId;

      const receiverId =
        newMessage.receiverId !== userId
          ? newMessage.receiverId
          : newMessage.senderId;

      if (!state.list[receiverId]) {
        return {
          ...state,
          list: {
            ...state.list,
            [receiverId]: {
              id: newMessage.conversationId,
              userIdA: newMessage.senderId,
              userIdB: newMessage.receiverId,
              messages: [newMessage],
            },
          },
        };
      }

      return {
        ...state,
        list: {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            messages: [...state.list[receiverId].messages, newMessage],
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
