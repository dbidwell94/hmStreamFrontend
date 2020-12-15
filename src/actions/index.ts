import {
  actionTypes,
  iSystemMessage,
  messageSeverity,
} from "../constants/Types";
import { ThunkDispatch } from "redux-thunk";
import { iState } from "../constants/State";
import iAction from "../constants/Action";
import { Dispatch } from "react";
import { v4 as uuid } from "uuid";

type iDispatch = ThunkDispatch<iState, undefined, iAction>;
type iGetState = () => iState;

function dispatchAction(dispatch: iDispatch, type: actionTypes, payload?: any) {
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
      dispatchAction(dispatch, actionTypes.HIDE_AUTH);
    } else {
      dispatchAction(dispatch, actionTypes.SHOW_AUTH);
    }
  };
}

export function sendSystemMessage(
  message: string,
  severity: messageSeverity,
  timeout?: number
) {
  return function (dispatch: iDispatch) {
    const sysMessage: iSystemMessage = {
      key: uuid(),
      message,
      severity,
      timeoutFunction: function () {
        dispatchAction(dispatch, actionTypes.REMOVE_SYSTEM_MESSAGE, this.key);
      },
    };

    dispatchAction(dispatch, actionTypes.SET_SYSTEM_MESSAGE, sysMessage);

    window.setTimeout(() => {
      sysMessage.timeoutFunction();
    }, timeout || 2000);
  };
}
