import { MutableRefObject, RefObject } from "react";
import { iRequestObject, iBufferedRange, iResponseObject } from "./types";
import axios from "axios";

export function base64ToUint8(input: string): Uint8Array {
  return Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
}

export function checkTimeRange(
  vidObj: RefObject<HTMLVideoElement>,
  buffer: MutableRefObject<SourceBuffer | null | undefined>
): boolean {
  if (
    vidObj.current != null &&
    vidObj.current != undefined &&
    buffer.current != null
  ) {
    const vidElement = vidObj.current;
    const remainingTime =
      buffer.current.buffered.end(0) - vidElement.currentTime;
    if (remainingTime < 60) {
      buffer.current.remove(
        buffer.current.buffered.start(0),
        vidElement.currentTime - 10
      );
      return true;
    }
  }
  return false;
}

export function onVideoSeek(
  vidElement: HTMLVideoElement,
  sourceBuffer: SourceBuffer,
  currentVidData: iRequestObject
): iRequestObject {
  const bufferedRange = {} as iBufferedRange;
  bufferedRange.lowerRange = sourceBuffer.buffered.start(0);
  bufferedRange.upperRange = sourceBuffer.buffered.end(0);
  bufferedRange.totalTime = vidElement.duration;
  bufferedRange.totalBytes = currentVidData.totalDataSize;

  const secondPerByte = (
    bufferedRange.totalBytes / bufferedRange.totalTime
  ).toFixed(0);

  let byteToGet =
    Number.parseInt(vidElement.currentTime.toFixed(0)) *
    Number.parseInt(secondPerByte);

  byteToGet = byteToGet - 10 < 0 ? 0 : byteToGet - 10;

  if (
    bufferedRange.lowerRange > vidElement.currentTime ||
    bufferedRange.upperRange < vidElement.currentTime
  ) {
    console.log("I don't have that range!");
    console.log({ totalSize: bufferedRange.totalBytes, byteToGet });
    return { ...currentVidData, totalDataRecieved: byteToGet };
  } else return currentVidData;
}

export function getBytes(
  startingAt: number,
  url: string
): Promise<iResponseObject> {
  const response = axios.get(url, {
    headers: {
      Allow: "video/webm",
      Range: `${startingAt} - `,
    },
  });
  return response
    .then((res) => {
      const range = res.headers["range"] as string;
      const bytesArr = range
        .match(new RegExp("\\d+", "igm"))
        ?.map((str) => Number.parseInt(str)) as number[];
      const totalBytes = bytesArr[0] == null ? null : bytesArr[0];
      const lowerLimit = bytesArr[1] == null ? null : bytesArr[1];
      const upperLimit = bytesArr[2] == null ? null : bytesArr[2];

      return {
        dataBuffer: base64ToUint8(res.data),
        endingBytes: upperLimit,
        requestObject: {
          totalDataRecieved: upperLimit,
          totalDataSize: totalBytes,
        },
      } as iResponseObject;
    })
    .catch((err) => {
      return {
        dataBuffer: null,
        endingBytes: null,
        requestObject: null,
      } as iResponseObject;
    });
}
