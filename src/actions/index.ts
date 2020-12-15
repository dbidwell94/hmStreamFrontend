import types from "../constants/Types";
import { ThunkDispatch } from "redux-thunk";
import { iState } from "../constants/State";
import iAction from "../constants/Action";

type iDispatch = ThunkDispatch<iState, undefined, iAction>;
type iGetState = () => iState;

function dispatchAction(dispatch: iDispatch, type: types, payload?: any) {
  const action: iAction = {
    type,
    payload,
  };
  dispatch(action);
}

export function toggleAuth() {
  return function (dispatch: iDispatch, getState: iGetState) {
    const { shouldShowLogin } = getState();
    if (shouldShowLogin) {
      dispatchAction(dispatch, types.HIDE_AUTH);
    } else {
      dispatchAction(dispatch, types.SHOW_AUTH);
    }
  };
}
