/**
 * @jest-environment jsdom
 */

import { base64ToUint8, checkTimeRange } from "./byteUtils";
import {
  createMockedVidRef,
  createMockSourceBuffer,
} from "../shared/testHelper";

describe("src/utils/byteUtils.ts", () => {
  it("Can convert a base64 string into a Uint64 array", () => {
    const base64String = btoa("this is a test string");
    const arr = base64ToUint8(base64String);
    expect(arr).toBeInstanceOf(Uint8Array);
  });

  it("Can determine if the video should begin buffering", () => {
    const vidElement = createMockedVidRef({
      durationInSeconds: 120,
      startTimeOffset: 90,
    });
    const sourceBuffer = createMockSourceBuffer({ start: 0, end: 95 });
    const result = checkTimeRange(vidElement, sourceBuffer);
    expect(result).toBe(true);
    const longerSourceBuffer = createMockSourceBuffer({ start: 0, end: 240 });
    const result2 = checkTimeRange(vidElement, longerSourceBuffer);
    expect(result2).toBe(false);
  });
});
