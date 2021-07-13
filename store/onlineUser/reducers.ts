import { HYDRATE } from "next-redux-wrapper";
import { UPDATE_LIST, ADD_ONLINE_USER, REMOVE_ONLINE_USER } from "./types";

const initialState = {
  list: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return { ...state, ...action.payload };
    }

    case UPDATE_LIST: {
      return { ...state, ...action.payload };
    }

    case ADD_ONLINE_USER: {
      const { user_id, socket_id } = action.payload;

      return {
        ...state,
        list: {
          ...state.list,
          [user_id]: socket_id,
        },
      };
    }

    case REMOVE_ONLINE_USER: {
      const { user_id } = action.payload;
      const newState = state;

      delete newState.list[user_id];

      return {
        ...state,
        ...newState,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
