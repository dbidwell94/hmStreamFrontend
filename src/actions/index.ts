import {
  actionTypes,
  iSystemMessage,
  messageSeverity,
} from "../constants/Types";
import { ThunkDispatch } from "redux-thunk";
import { iState } from "../constants/State";
import iAction from "../constants/Action";
import { v4 as uuid } from "uuid";
import decode from "jwt-decode";

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
  timeout: number = 4000
) {
  return function (dispatch: iDispatch) {
    const sysMessage: iSystemMessage = {
      key: uuid(),
      message,
      severity,
      timeoutFunction: function () {
        dispatchAction(dispatch, actionTypes.REMOVE_SYSTEM_MESSAGE, this.key);
      },
      totalAliveTime: timeout,
    };

    dispatchAction(dispatch, actionTypes.SET_SYSTEM_MESSAGE, sysMessage);

    window.setTimeout(() => {
      sysMessage.timeoutFunction();
    }, timeout);
  };
}

export function loadAuth() {
  return function (dispatch: iDispatch) {
    const storageToken = window.localStorage.getItem("token");
    if (storageToken) {
      const decoded = decode(storageToken) as {
        id: number;
        email: string;
        username: string;
      } | null;
      if (decoded) {
        dispatchAction(dispatch, actionTypes.SET_AUTH, {
          token: storageToken,
          userId: decoded.id,
        });
        dispatch(
          sendSystemMessage(
            `Welcome back, ${decoded.username}`,
            messageSeverity.INFORMATIONAL
          )
        );
      }
    }
  };
}

export function setMediaServerAddress(address: string) {
  return function (dispatch: iDispatch) {
    dispatchAction(dispatch, actionTypes.SET_MEDIA_IP_ADDRESS, address);
  };
}

export function logout() {
  return function (dispatch: iDispatch) {
    window.localStorage.removeItem("token");
    dispatchAction(dispatch, actionTypes.SET_AUTH, {
      userId: null,
      token: null,
    });
  };
}
