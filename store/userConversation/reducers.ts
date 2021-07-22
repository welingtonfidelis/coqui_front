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
  START_MORE_MESSAGES_LOAD,
  STOP_LIST_LOAD,
  STOP_MORE_MESSAGES_LOAD,
  UPDATE_ID,
  UPDATE_LIST,
} from "./types";

const initialState: ConversationReducerInterface = {
  loadingList: false,
  list: {},
  countNewMessages: 0,
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
      let countNewMessages = 0;

      const list = {};
      conversations.list.forEach((item, index) => {
        const receiverId =
          item.userIdA !== userId ? item.userIdA : item.userIdB;

        item.newMessage ? (countNewMessages += 1) : null;

        list[receiverId] = item;
      });

      return {
        ...state,
        countNewMessages,
        list,
      };
    }

    case UPDATE_ID: {
      const { receiverId, conversationId } = action.payload;

      return {
        ...state,
        list: {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            id: conversationId,
          },
        },
      };
    }

    case START_MORE_MESSAGES_LOAD: {
      const { receiverId } = action.payload;

      return {
        ...state,
        list: {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            loadingMoreMessages: true
          },
        },
      };
    }

    case STOP_MORE_MESSAGES_LOAD: {
      const { receiverId } = action.payload;

      return {
        ...state,
        list: {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            loadingMoreMessages: false
          },
        },
      };
    }

    case INSERT_OLD_MESSAGES: {
      const {
        messages: oldMessages,
        receiverId,
        hasMoreMessages,
        pageMessages,
      } = action.payload;

      const newState = state;
      if (oldMessages.length) {
        newState.list = {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            messages: [...oldMessages, ...state.list[receiverId].messages],
          },
        };
      }

      return {
        ...newState,
        list: {
          ...newState.list,
          [receiverId]: {
            ...newState.list[receiverId],
            hasMoreMessages,
            pageMessages
          },
        },
      };
    }

    case INSERT_NEW_MESSAGE: {
      const newMessage: MessageItemReducerInterface = action.payload.message;
      const userId = action.payload.userId;

      const receiverId =
        newMessage.toUserId !== userId
          ? newMessage.toUserId
          : newMessage.fromUserId;
      let countNewMessages = state.countNewMessages + 1;

      if (newMessage.fromUserId === userId) countNewMessages = 0;

      if (!state.list[receiverId]) {
        return {
          ...state,
          countNewMessages,
          list: {
            ...state.list,
            [receiverId]: {
              id: newMessage.conversationId,
              userIdA: newMessage.fromUserId,
              userIdB: newMessage.toUserId,
              hasMoreMessages: false,
              pageMessages: 1,
              limitPerPageMessages: 10,
              messages: [newMessage],
              newMessage: receiverId === userId,
            },
          },
        };
      }

      return {
        ...state,
        countNewMessages,
        list: {
          ...state.list,
          [receiverId]: {
            ...state.list[receiverId],
            messages: [...state.list[receiverId].messages, newMessage],
            newMessage: receiverId === userId,
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
