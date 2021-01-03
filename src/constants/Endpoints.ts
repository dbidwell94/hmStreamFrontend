export const BASE_URL = "http://localhost:2019";

export function getBytesEndpoint(fileName: string) {
  return `${BASE_URL}/video/${fileName}/bytes`;
}
