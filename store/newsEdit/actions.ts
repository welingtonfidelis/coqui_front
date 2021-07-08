import { NewsItemReducerInterface } from "./model";
import { 
  START_LIST_LOAD, STOP_LIST_LOAD, UPDATE_LIST, START_SAVE_LOAD, 
  STOP_SAVE_LOAD, START_ITEM_ACTION_LOAD, STOP_ITEM_ACTION_LOAD 
} from "./types";

export const newsStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const newsStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const newsUpdateList = (payload: NewsItemReducerInterface[]) => ({
  type: UPDATE_LIST,
  payload,
});

export const newsStartSaveLoading = () => ({
  type: START_SAVE_LOAD,
});

export const newsStopSaveLoading = () => ({
  type: STOP_SAVE_LOAD,
});

export const newsStartItemActionLoading = (payload: number) => ({
  type: START_ITEM_ACTION_LOAD,
  payload
});

export const newsStopItemActionLoading = (payload: number) => ({
  type: STOP_ITEM_ACTION_LOAD,
  payload
});
