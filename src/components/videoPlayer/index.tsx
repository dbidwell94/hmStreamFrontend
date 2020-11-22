import React, {
  useEffect,
  createRef,
  RefObject,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

interface iVideoData {
  message: string;
  data: number[];
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  video {
    width: 100%;
    height: auto;
    background: rgba(50, 50, 50, 0.5);
  }
`;

export default function VideoPlayer() {
  let streamer = null as WebSocket | null;

  const vidObj = createRef() as RefObject<HTMLVideoElement>;
  const webStream = useRef(new MediaSource());
  const [buffer, setBuffer] = useState(null as SourceBuffer | null);

  useEffect(() => {
    webStream.current.addEventListener("sourceopen", (evt) => {
      setBuffer(
        webStream.current.addSourceBuffer('video/webm; codecs="vp8, vorbis"')
      );
    });

    webStream.current.addEventListener("sourceclose", (evt) => {
      console.log(evt);
    });

    (vidObj.current as HTMLVideoElement).src = URL.createObjectURL(
      webStream.current
    );
  }, []);

  // Here we initialize our websocket and do logic based on what happens when we get our video data from the backend
  useEffect(() => {
    if (buffer != null) {
      streamer = new WebSocket("ws://10.0.0.167:2019/vidstream");
      streamer.binaryType = "arraybuffer";

      streamer.onopen = (evt) => {
        streamer?.send("start");
      }

      streamer.onmessage = (mess: MessageEvent<any>) => {
        console.log(mess);
        if (mess.data instanceof Blob) {
          const data = JSON.parse((mess.data as unknown) as string);
          console.log(data);
        } else if (mess.data instanceof ArrayBuffer) {
          const data = mess.data;
          const arr = new Uint8Array(data);

          const vidData = { message: "", data: [] } as iVideoData;
          let stringBuffer = "";
          let isParsingData = false;
          arr.forEach((byte) => {
            if (!isParsingData) {
              const character = String.fromCharCode(byte);
              stringBuffer += character;
              if (
                stringBuffer
                  .toLowerCase()
                  .includes("~~~~~data~~~~~".toLowerCase())
              ) {
                vidData.message = stringBuffer.replace("~~~~~data~~~~~", "");
                isParsingData = true;
              }
            } else {
              vidData.data.push(byte);
            }
          });
          const videoData = new Uint8Array(vidData.data);
          buffer.appendBuffer(videoData.buffer);
        }
      };

      buffer.addEventListener("error", (evt) => {
        console.log(evt);
      });

      buffer.addEventListener("updateend", (evt) => {
        streamer?.send("next");
      });
    }
  }, [buffer]);

  return (
    <Container>
      <video controls ref={vidObj} />
    </Container>
  );
}
