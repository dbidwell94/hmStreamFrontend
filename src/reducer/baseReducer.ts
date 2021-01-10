import Action from "../constants/Action";
import { actionTypes, iAuthentication } from "../constants/Types";
import { iState } from "../constants/State";
import decode from "jwt-decode";

function getToken(): iAuthentication {
  const token = window.localStorage.getItem("token");
  if (token) {
    const decoded = decode(token) as {
      id: number;
      email: string;
      username: string;
    };
    return {
      token: token,
      userId: decoded.id,
    };
  } else {
    return {
      token: null,
      userId: null,
    };
  }
}

const initialState: iState = {
  shouldShowLogin: false,
  videoIsPlaying: false,
  systemMessages: [],
  authentication: getToken(),
  mediaServerIpAddress: null,
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
          if (message.key !== (action.payload as string)) {
            return message;
          }
        }),
      };

    case actionTypes.SET_MEDIA_IP_ADDRESS:
      return {
        ...state,
        mediaServerIpAddress: action.payload
      };

    case actionTypes.SET_AUTH:
      return {
        ...state,
        authentication: action.payload,
      };

    default:
      return state;
  }
}
