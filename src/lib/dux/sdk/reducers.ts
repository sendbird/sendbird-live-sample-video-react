import ActionTypes from './actionTypes';
import initialState from './initialState';
import SDKState from "./types";

export interface Action {
  type: ActionTypes;
  payload?: any;
}

export default function reducer(state: SDKState, action: Action): SDKState {
  switch (action.type) {
    case ActionTypes.SET_SDK_LOADING:
      return {
        ...state,
        initialized: false,
        loading: action.payload,
      };
    case ActionTypes.INIT_SDK:
      return {
        initialized: true,
        loading: false,
        error: false,
      };
    case ActionTypes.RESET_SDK:
      return initialState;
    case ActionTypes.SDK_ERROR:
      return {
        initialized: false,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
}