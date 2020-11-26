export type iRequestObject = {
  totalDataRecieved: number;
  totalDataSize: number;
};

export type iBufferedRange = {
  lowerRange: number;
  upperRange: number;
  totalTime: number;
  totalBytes: number;
};

export type iResponseObject = {
  dataBuffer: Uint8Array | null;
  endingBytes: number | null;
  requestObject: iRequestObject | null;
};
