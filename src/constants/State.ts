import { iAuthentication, iSystemMessage } from "./Types";

export interface iState {
  shouldShowLogin: boolean;
  videoIsPlaying: boolean;
  systemMessages: iSystemMessage[];
  authentication: iAuthentication;
  mediaServerIpAddress: string | null
}
