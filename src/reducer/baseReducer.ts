import Action from "../constants/Action";
import types from "../constants/Types";
import {iState} from "../constants/State";

const initialState: iState = {
  shouldShowLogin: false,
};

export default function (state = initialState, action: Action) {
  switch (action.type) {
    case types.SHOW_AUTH:
      return { ...state, shouldShowLogin: true };

    case types.HIDE_AUTH:
      return { ...state, shouldShowLogin: false};

    default:
      return state;
  }
}
