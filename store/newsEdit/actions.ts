import { NewsItemReducerInterface } from "./model";
import { 
  START_LIST_LOAD, STOP_LIST_LOAD, UPDATE_LIST, START_SAVE_LOAD, 
  STOP_SAVE_LOAD, START_ITEM_ACTION_LOAD, STOP_ITEM_ACTION_LOAD 
} from "./types";

export const newsEditStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const newsEditStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const newsEditUpdateList = (payload: NewsItemReducerInterface[]) => ({
  type: UPDATE_LIST,
  payload,
});

export const newsEditStartSaveLoading = () => ({
  type: START_SAVE_LOAD,
});

export const newsEditStopSaveLoading = () => ({
  type: STOP_SAVE_LOAD,
});

export const newsEditStartItemActionLoading = (payload: number) => ({
  type: START_ITEM_ACTION_LOAD,
  payload
});

export const newsEditStopItemActionLoading = (payload: number) => ({
  type: STOP_ITEM_ACTION_LOAD,
  payload
});
