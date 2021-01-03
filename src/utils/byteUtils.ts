import axios, { AxiosResponse } from "axios";
import { getBytesEndpoint } from "../constants/Endpoints";
import { iVideoData } from "../constants/Types";

export const MAX_BYTE_SIZE = 1000000;

type getBytesOptions = {
  startingAt: number;
  endingAt: number;
  fileName: string;
};

export async function getBytes(options: getBytesOptions): Promise<iVideoData> {
  const range = `bytes=${options.startingAt}-${options.endingAt}`;
  const response = (await axios.get(getBytesEndpoint(options.fileName), {
    headers: { range },
  })) as AxiosResponse<iVideoData>;
  return response.data;
}

export function stringToUint8Arr(input: string): Uint8Array {
  return Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
}
