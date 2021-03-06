export enum actionTypes {
  SHOW_AUTH = "SHOW_AUTH",
  HIDE_AUTH = "HIDE_AUTH",
  SET_VIDEO_IS_PLAYING = "SET_VIDEO_IS_PLAYING",
  SET_SYSTEM_MESSAGE = "SET_SYSTEM_MESSAGE",
  REMOVE_SYSTEM_MESSAGE = "REMOVE_SYSTEM_MESSAGE",
  SET_AUTH = "SET_AUTH",
  SET_MEDIA_IP_ADDRESS = "SET_MEDIA_IP_ADDRESS",
  NULL = "null"
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
  totalAliveTime: number;
  key: string;
};

export type iServerError = {
  timestamp: string;
  message: string;
  details: string;
  path: string;
  errors: string;
  developerInfo: string[];
};

export type iVideoData = {
  dataSize: number;
  videoData: string;
  remainingBytes: number;
};

export type iVideoDetails = {
  videoSize: number;
  videoName: string;
  duration: string;
  videoFormat: string;
  audioFormat: string;
  fps: number;
};

export type iAuthentication = {
  token: string | null;
  userId: number | null;
};
