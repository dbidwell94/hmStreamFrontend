import React, {
  useEffect,
  createRef,
  RefObject,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

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
        webStream.current.addSourceBuffer(
          'video/webm; codecs="vp8, vorbis"'
        )
      );
    });

    webStream.current.addEventListener("sourceclose", (evt) => {
      console.log(evt);
    });

    (vidObj.current as HTMLVideoElement).src = URL.createObjectURL(
      webStream.current
    );
  }, []);

  useEffect(() => {
    if (buffer != null) {
      streamer = new WebSocket("ws://localhost:2019/vidstream");
      streamer.binaryType = "arraybuffer";
      streamer.onmessage = (mess: MessageEvent<ArrayBuffer>) => {
        buffer.appendBuffer(mess.data)
      };

      buffer.addEventListener("error", (evt) => {
        console.log(evt)
      });

      buffer.addEventListener("updateend", (evt) => {
        
      });
    }



  }, [buffer]);

  return (
    <Container>
      <video autoPlay controls ref={vidObj}></video>
    </Container>
  );
}
