export enum actionTypes {
  SHOW_AUTH = "SHOW_AUTH",
  HIDE_AUTH = "HIDE_AUTH",
  SET_VIDEO_IS_PLAYING = "SET_VIDEO_IS_PLAYING",
  SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE",
  REMOVE_SYSTEM_MESSAGE = "REMOVE_SYSTEM_MESSAGE",
}

export enum messageSeverity {
  CRITICAL = "CRITICAL",
  URGENT = "URGENT",
  INFORMATIONAL = "INFORMATIONAL",
}

export type iSystemMessage = {
  severity: messageSeverity;
  message: string;
  timeoutFunction: Function;
  key: string;
};
