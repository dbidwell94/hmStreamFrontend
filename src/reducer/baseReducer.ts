import Action from "../constants/Action";
import { actionTypes, iSystemMessage } from "../constants/Types";
import { iState } from "../constants/State";

const initialState: iState = {
  shouldShowLogin: false,
  videoIsPlaying: false,
  systemMessages: [],
};

function throwReducerError(type: string) {
  throw new Error(`Error: Input type was not of type: ${type}`);
}

export default function (state = initialState, action: Action): iState {
  switch (action.type) {
    case actionTypes.SHOW_AUTH:
      return { ...state, shouldShowLogin: true };

    case actionTypes.HIDE_AUTH:
      return { ...state, shouldShowLogin: false };

    case actionTypes.SET_VIDEO_IS_PLAYING:
      if (typeof action.payload != "boolean") {
        throwReducerError(typeof true);
      }
      return { ...state, videoIsPlaying: action.payload };

    case actionTypes.SET_SYSTEM_MESSAGE:
      return {
        ...state,
        systemMessages: [...state.systemMessages, action.payload],
      };

    case actionTypes.REMOVE_SYSTEM_MESSAGE:
      return {
        ...state,
        systemMessages: state.systemMessages.filter((message) => {
          if (message.key != (action.payload as iSystemMessage).key) {
            return message;
          }
        }),
      };

    default:
      return state;
  }
}
