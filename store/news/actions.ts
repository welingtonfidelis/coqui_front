import { NewsItemReducerInterface } from "./model";
import { 
  START_LIST_LOAD, STOP_LIST_LOAD, UPDATE_LIST
} from "./types";

export const newsStartListLoading = () => ({
  type: START_LIST_LOAD,
});

export const newsStopListLoading = () => ({
  type: STOP_LIST_LOAD,
});

export const newsUpdateList = (payload: NewsItemReducerInterface[]) => ({
  type: UPDATE_LIST,
  payload
});

