import { createWrapper } from "next-redux-wrapper";
import { combineReducers, createStore } from "redux";

import user from "./user/reducers";
import news from "./news/reducers";
import newsEdit from "./newsEdit/reducers";
import conversation from "./userConversation/reducers";
import chatUsers from "./chatUsers/reducers";
import systemUser from "./systemUser/reducers";
import onlineUser from "./onlineUser/reducers";
import company from "./company/reducers";

const reducers = combineReducers({
  user,
  news,
  newsEdit,
  conversation,
  chatUsers,
  systemUser,
  onlineUser,
  company
});

const makeStore = () => {
  const store = createStore(reducers);

  return store;
};

export const storeWrapper = createWrapper(makeStore);
