import { CompanyItemReducerInterface } from "./model";
import { 
  START_ITEM_ACTION_LOAD, START_LIST_LOAD, START_SAVE_LOAD, 
  STOP_ITEM_ACTION_LOAD, STOP_LIST_LOAD, STOP_SAVE_LOAD, UPDATE_LIST
} from "./types";

export const companyStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const companyStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const companyStartSaveLoading = () => ({
  type: START_SAVE_LOAD,
});

export const companyStopSaveLoading = () => ({
  type: STOP_SAVE_LOAD,
});

export const companyStartItemActionLoading = (payload: number) => ({
  type: START_ITEM_ACTION_LOAD,
  payload
});

export const companyStopItemActionLoading = (payload: number) => ({
  type: STOP_ITEM_ACTION_LOAD,
  payload
});

export const companyUpdateList = (payload: CompanyItemReducerInterface[]) => ({
  type: UPDATE_LIST,
  payload
});

