import { HYDRATE } from "next-redux-wrapper";
import { START_LIST_LOAD, STOP_LIST_LOAD, UPDATE_LIST } from "./types";

const initialState = {
  loadingList: false,
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
      const newState = { ...state, list: action.payload };

      return newState;
    }

    default: {
      return state;
    }
  }
};

export default reducer;
