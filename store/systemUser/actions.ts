import { SystemUserListReducerInterface } from "./model";
import { 
  START_ITEM_ACTION_LOAD, START_LIST_LOAD, START_SAVE_LOAD, 
  STOP_ITEM_ACTION_LOAD, STOP_LIST_LOAD, STOP_SAVE_LOAD, UPDATE_LIST
} from "./types";

export const systemUserStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const systemUserStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const systemUserStartSaveLoading = () => ({
  type: START_SAVE_LOAD,
});

export const systemUserStopSaveLoading = () => ({
  type: STOP_SAVE_LOAD,
});

export const systemUserStartItemActionLoading = (payload: number) => ({
  type: START_ITEM_ACTION_LOAD,
  payload
});

export const systemUserStopItemActionLoading = (payload: number) => ({
  type: STOP_ITEM_ACTION_LOAD,
  payload
});

export const systemUserUpdateList = (payload: SystemUserListReducerInterface[]) => ({
  type: UPDATE_LIST,
  payload
});

