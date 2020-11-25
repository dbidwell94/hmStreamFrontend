import React, {
  useEffect,
  createRef,
  RefObject,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import axios from 'axios';
import {base64ToUint8} from '../../utils/byteUtils';

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
    width: auto;
    height: 100%;
    background: rgba(50, 50, 50, 0.5);
  }
`;

type iRequestObject = {
  totalDataRecieved: number,
  totalDataSize: number
}

const vidFile = "wal";

export default function VideoPlayer() {

  const vidDataSource = useRef(new MediaSource()) as React.MutableRefObject<MediaSource | null>;
  const vidObject = createRef() as RefObject<HTMLVideoElement>;
  const sourceBuffer = useRef(null) as React.MutableRefObject<SourceBuffer | null | undefined>;

  const [allowRequests, setAllowRequests] = useState(false);
  const [requestObject, setRequestObject] = useState({totalDataRecieved: 0, totalDataSize: 0} as iRequestObject);
  const [readyToProcess, setReadyToProcess] = useState(false);

  useEffect(() => {
    (vidDataSource.current as MediaSource).addEventListener("sourceopen", (evt) => {
      sourceBuffer.current = (vidDataSource.current as MediaSource).addSourceBuffer('video/webm ; codecs="vp8, vorbis"');
      setAllowRequests(true);
    });
    (vidObject.current as HTMLVideoElement).src = URL.createObjectURL((vidDataSource.current as MediaSource));
  }, []);

  useEffect(() => {
    if(allowRequests) {
      sourceBuffer.current?.addEventListener("updateend", (evt) => {
        setReadyToProcess(true);
      })

      vidDataSource.current?.addEventListener("sourceclose", (evt) => {
        console.error(evt);
      })

      sourceBuffer.current?.addEventListener("error", (evt) => {
        console.error(evt);
      })

      axios.get(`http://localhost:2019/video/${vidFile}.webm`, {headers: {"Allow": "video/webm", "Range": `${requestObject.totalDataRecieved}-`}})
        .then(res => {
          const rangeHeader = res.headers['range'] as string;
          const totalSizeArr = rangeHeader.match(new RegExp("bytes=(\\d+)"));
          let totalSize : number;
          if(totalSizeArr && totalSizeArr.length > 0) {
            totalSize = Number.parseInt(totalSizeArr[1]);
          }
          else {
            totalSize = 0;
          }
          const upperLimit = Number.parseInt(rangeHeader.replace(new RegExp("bytes=\\d+ / "), "").split("-")[1]);
          setRequestObject({totalDataSize: totalSize, totalDataRecieved: upperLimit})
          const arr = base64ToUint8(res.data);
          sourceBuffer.current?.appendBuffer(arr);
        })
    }
  }, [allowRequests])

  useEffect(() => {
    if(readyToProcess && requestObject.totalDataSize > requestObject.totalDataRecieved) {
      axios.get(`http://localhost:2019/video/${vidFile}.webm`, {headers: {"Allow": "video/webm", "Range": `${requestObject.totalDataRecieved}-`}})
        .then(res => {
          const rangeHeader = res.headers['range'] as string;
          const upperLimit = Number.parseInt(rangeHeader.replace(new RegExp("bytes=\\d+ / "), "").split("-")[1]);
          const arr = base64ToUint8(res.data);
          setRequestObject({...requestObject, totalDataRecieved: requestObject.totalDataRecieved + upperLimit})
          try {
            sourceBuffer.current?.appendBuffer(arr);
          }
          catch(err) {
            if(err instanceof(DOMException)) {
              if(err.name === "QuotaExceededError") {
                console.log(err);
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
        setReadyToProcess(false);
    }
  }, [readyToProcess])

  return (
    <Container>
      <video autoPlay controls ref={vidObject}/>
    </Container>
  );
}
