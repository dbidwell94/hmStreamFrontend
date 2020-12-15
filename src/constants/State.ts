import { iSystemMessage } from "./Types";

export interface iState {
  shouldShowLogin: boolean;
  videoIsPlaying: boolean;
  systemMessages: iSystemMessage[]
}
