import { HYDRATE } from "next-redux-wrapper";
import {
  ConversationItemReducerInterface,
  ConversationReducerInterface,
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
  conversationIdIndex: {},
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
      const conversations: ConversationReducerInterface =
        action.payload.conversationList;
      const userId = action.payload.userId;
      const conversationIdIndex = {};

      conversations.list.forEach((item, index) => {
        const receiverId =
          item.userIdA !== userId ? item.userIdA : item.userIdB;

        conversationIdIndex[receiverId] = index;
      });
      const newState = { ...state, ...conversations, conversationIdIndex };

      return newState;
    }

    case INSERT_NEW_CONVERSATION: {
      const newConversation: ConversationItemReducerInterface = action.payload;
      const userId = action.payload.userId;
      const newState = state;

      if (newConversation) {
        const receiverId =
          newConversation.userIdA !== userId
            ? newConversation.userIdA
            : newConversation.userIdB;

        newState.conversationIdIndex[receiverId] = newState.list.length;
        newState.list.push(newConversation);
      }

      return newState;
    }

    case INSERT_OLD_MESSAGES: {
      const oldMessages: MessageItemReducerInterface[] =
        action.payload.messageList;
      const userId = action.payload.userId;
      const newState = state;

      if (oldMessages.length) {
        const receiverId =
          oldMessages[0].receiverId !== userId
            ? oldMessages[0].receiverId
            : oldMessages[0].senderId;
        const index = newState.conversationIdIndex[receiverId];

        newState.list[index].messages = [
          ...oldMessages,
          ...newState.list[index].messages,
        ];
      }

      return newState;
    }

    case INSERT_NEW_MESSAGE: {
      const newMessage: MessageItemReducerInterface = action.payload.message;
      const userId = action.payload.userId;
      const newState = state;

      if (newMessage) {
        const receiverId =
          newMessage.receiverId !== userId
            ? newMessage.receiverId
            : newMessage.senderId;
        const index = newState.conversationIdIndex[receiverId];
        newState.list[index].messages.push(newMessage);
      }

      return newState;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
