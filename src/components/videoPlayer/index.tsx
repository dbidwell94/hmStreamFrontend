import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { checkTimeRange, onVideoSeek, getBytes } from "../../utils/byteUtils";
import { iRequestObject } from "../../utils/types";

interface iVideoData {
  message: string;
  data: number[];
}

interface iVideoRouterParam {
  vidName: string;
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
    background: transparent;
  }
`;

export default function VideoPlayer() {
  const { vidName } = useParams() as iVideoRouterParam;

  //#region Ref Objects
  const vidDataSource = useRef(
    new MediaSource()
  ) as React.MutableRefObject<MediaSource>;

  const vidObject = useRef(null) as MutableRefObject<HTMLVideoElement | null>;

  const sourceBuffer = useRef(
    null
  ) as React.MutableRefObject<SourceBuffer | null>;

  const bufferQueue = useRef([] as Uint8Array[]);

  const vidDataDetails = useRef({
    totalDataSize: 0,
    totalDataRecieved: 0,
  } as iRequestObject);
  //#endregion

  //#region State Objects
  const [sourceOpen, setSourceOpen] = useState(false);
  const [allowBufferAppend, setAllowBufferAppend] = useState(false);
  //#endregion

  /**
   * This handles the initial loading of the component. Attach the MediaSource to the
   * Video object, and add 3 event listeners to the vidDataSource
   */
  useEffect(() => {
    // Set the document title to contain the title of the video being watched
    document.title = `${document.title} - ${vidName}`;

    if (vidObject.current) {
      vidObject.current.src = URL.createObjectURL(vidDataSource.current);

      vidDataSource.current.addEventListener("sourceopen", (evt) => {
        setSourceOpen(true);
      });

      vidDataSource.current.addEventListener("sourceclose", (evt) => {
        setSourceOpen(false);
      });

      vidDataSource.current.addEventListener("sourceended", (evt) => {
        setSourceOpen(false);
      });
    }
  }, []);

  /**
   * When the MediaSource is appended to the <video /> element, this useEffect is run
   * to add event listeners to the sourceBuffer
   */
  useEffect(() => {
    if (sourceOpen) {
      try {
        sourceBuffer.current = vidDataSource.current.addSourceBuffer(
          'video/webm ; codecs="vp8,vorbis"'
        );

        sourceBuffer.current.addEventListener("updateend", (evt) => {
          retrieveData();
        });

        sourceBuffer.current.addEventListener("updatestart", (evt) => {});
      } catch (err) {
        console.error(err);
      }
      retrieveData();
    }
  }, [sourceOpen]);

  function retrieveData() {
    getBytes(
      vidDataDetails.current.totalDataRecieved,
      `http://localhost:2019/video/${vidName}.webm`
    )
      .then((arr) => {
        if (arr.dataBuffer && arr.requestObject) {
          bufferQueue.current.push(arr.dataBuffer);
          if (
            !sourceBuffer.current?.updating &&
            (vidDataDetails.current.totalDataRecieved <
              vidDataDetails.current.totalDataSize ||
              vidDataDetails.current.totalDataSize === 0)
          ) {
            sourceBuffer.current?.appendBuffer(arr.dataBuffer);
            vidDataDetails.current = arr.requestObject;
          }
        }
      })
      .catch((err) => {
        if (err instanceof DOMException) {
          if (
            err.name.toLowerCase().includes("QuotaExceededError".toLowerCase())
          ) {
            /**
             * In this case, we cannot append to our buffer as the quota is full. We need
             * to wait for the next oppertune time to remove from our previous buffer
             * and get new data.
             */
            const checkQuota = window.setInterval(() => {
              if (checkTimeRange(vidObject, sourceBuffer)) {
                console.log("Ready to delete and get new data");
                window.clearInterval(checkQuota);
              }
            }, 500);
          }
        }
      });
  }

  return (
    <Container>
      <video autoPlay controls ref={vidObject} />
    </Container>
  );
}
