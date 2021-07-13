import { HYDRATE } from "next-redux-wrapper";
import { LOCAL_STORAGE_ENUM } from "../../components/enums/localStorage";
import {
  LOGIN,
  LOGOUT,
  START_LOGIN_LOAD,
  START_PROFILE_LOAD,
  STOP_LOGIN_LOAD,
  STOP_PROFILE_LOAD,
  UPDATE_PROFILE,
  UPDATE_TOKEN,
} from "./types";

const initialState = {
  id: null,
  name: null,
  email: null,
  token: null,
  user: null,
  phone: null,
  birth: null,
  address: null,
  profileImage: null,
  role: null,

  loadingLogin: false,
  loadingProfile: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return { ...state, ...action.payload.user };
    }

    case LOGIN: {
      localStorage.setItem(LOCAL_STORAGE_ENUM.TOKEN, action.payload.token);

      const newState = { ...state, loadingLogin: false, ...action.payload };
      return newState;
    }

    case LOGOUT: {
      localStorage.removeItem(LOCAL_STORAGE_ENUM.TOKEN);

      const newState = {
        id: null,
        name: null,
        email: null,
        token: null,
        user: null,
        companyName: null,
        phone: null,
        birth: null,
        address: null,
        profileImage: null,
      };
      return newState;
    }

    case START_LOGIN_LOAD: {
      const newState = { ...state, loadingLogin: true };
      return newState;
    }

    case STOP_LOGIN_LOAD: {
      const newState = { ...state, loadingLogin: false };
      return newState;
    }

    case UPDATE_TOKEN: {
      localStorage.setItem(LOCAL_STORAGE_ENUM.TOKEN, action.payload.token);

      const newState = { ...state, token: action.payload };
      return newState;
    }

    case START_PROFILE_LOAD: {
      const newState = { ...state, loadingProfile: true };
      return newState;
    }

    case STOP_PROFILE_LOAD: {
      const newState = { ...state, loadingProfile: false };
      return newState;
    }

    case UPDATE_PROFILE: {
      return { ...state, ...action.payload };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
