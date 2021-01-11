export function getBytesEndpoint(fileName: string, url: string | null) {
  if (!url) {
    throw new Error("unable to get bytes from null url");
  }
  return `https://${url}/video/${fileName}/bytes`;
}
