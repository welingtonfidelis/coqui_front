import { UserLoginReducerInterface, UserReducerInterface } from "./model";
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

export const userLogin = (payload: UserLoginReducerInterface) => ({
  type: LOGIN,
  payload,
});

export const userLogout = () => ({
  type: LOGOUT,
});

export const userStartLoginLoading = () => ({
  type: START_LOGIN_LOAD,
});

export const userStopLoginLoading = () => ({
  type: STOP_LOGIN_LOAD,
});

export const userUpdateToken = (token: string) => ({
  type: UPDATE_TOKEN,
  payload: token,
});

export const userStartProfileLoading = () => ({
  type: START_PROFILE_LOAD,
});

export const userStopProfileLoading = () => ({
  type: STOP_PROFILE_LOAD,
});

export const userUpdateProfile = (payload: UserReducerInterface) => ({
  type: UPDATE_PROFILE,
  payload,
});
