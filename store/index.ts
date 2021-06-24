import { createWrapper } from "next-redux-wrapper";
import { combineReducers, createStore } from "redux";

import user from './user/reducers';
import news from './news/reducers';

const reducers = combineReducers({
    user,
    news
});

const makeStore = () => {
    const store = createStore(reducers);

    return store;
}

export const storeWrapper = createWrapper(makeStore);