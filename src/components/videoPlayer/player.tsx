import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendSystemMessage, setMediaServerAddress } from "../../actions";
import {
  messageSeverity,
  iServerError,
  iVideoDetails,
} from "../../constants/Types";
import axios, { AxiosError, AxiosResponse } from "axios";
import {
  getBytes,
  stringToUint8Arr,
  MAX_BYTE_SIZE,
} from "../../utils/byteUtils";
import { iState } from "../../constants/State";

interface iVideoRouterParam {
  vidName: string;
}

type iMediaObjects = {
  mediaSource: MediaSource;
  sourceBuffer: SourceBuffer | null;
};

const Container = styled.div`
  width: 100vw;
  height: calc(100vh - 6rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 0;
  video {
    width: auto;
    height: 100%;
    z-index: 0;
  }
`;

export default function VideoPlayer() {
  const { vidName } = useParams() as iVideoRouterParam;
  const dispatch = useDispatch();

  const baseUrl = useSelector((state: iState) => state.mediaServerIpAddress);

  const videoObject = useRef(null) as MutableRefObject<null | HTMLVideoElement>;
  const mediaObjects = useRef({
    mediaSource: new MediaSource(),
    sourceBuffer: null,
  } as iMediaObjects);

  const [videoDetails, setVideoDetails] = useState(
    null as iVideoDetails | null
  );

  const [readyToAppend, setReadyToAppend] = useState(false);

  const [sourceBufferStatus, setSourceBufferStatus] = useState({
    currentBytePos: 0,
    remainingBytes: 0,
  });

  useEffect(() => {
    function setupSourceBuffer(codec: string) {
      if (MediaSource.isTypeSupported(codec)) {
        mediaObjects.current.mediaSource.addEventListener(
          "sourceopen",
          (evt) => {
            mediaObjects.current.sourceBuffer = mediaObjects.current.mediaSource.addSourceBuffer(
              codec
            );
            mediaObjects.current.sourceBuffer.addEventListener(
              "updateend",
              (evt) => {
                setReadyToAppend(true);
              }
            );
            setReadyToAppend(true);
          }
        );
        if (videoObject.current) {
          videoObject.current.src = URL.createObjectURL(
            mediaObjects.current.mediaSource
          );
        }
      } else {
        dispatch(
          sendSystemMessage(
            `${codec} is not supported`,
            messageSeverity.CRITICAL
          )
        );
      }
    }

    axios
      .get(`http://localhost:2019/video/${vidName}.webm`)
      .then((res: AxiosResponse<iVideoDetails | null>) => {
        if (res.data) {
          const videoType = res.data?.videoName.split(".")[1];
          setVideoDetails(res.data);
          setSourceBufferStatus({
            ...sourceBufferStatus,
            remainingBytes: res.data.videoSize,
          });
          setupSourceBuffer(
            `video/${videoType}; codecs="${res.data?.videoFormat}, ${res.data?.audioFormat}"`
          );
        }
      })
      .catch((err: AxiosError<iServerError>) => {
        dispatch(
          sendSystemMessage(
            err.response?.data.message || err.message,
            messageSeverity.CRITICAL
          )
        );
      });
  }, []);

  useEffect(() => {
    if (mediaObjects.current.sourceBuffer && readyToAppend && videoDetails) {
      if (sourceBufferStatus.remainingBytes > 0) {
        getBytes({
          fileName: videoDetails.videoName,
          endingAt: sourceBufferStatus.currentBytePos + MAX_BYTE_SIZE,
          startingAt: sourceBufferStatus.currentBytePos,
          baseUrl: baseUrl,
        })
          .then((res) => {
            setSourceBufferStatus({
              ...sourceBufferStatus,
              remainingBytes: res.remainingBytes,
              currentBytePos: sourceBufferStatus.currentBytePos + MAX_BYTE_SIZE,
            });
            const data = stringToUint8Arr(res.videoData);
            mediaObjects.current.sourceBuffer?.appendBuffer(data);
            setReadyToAppend(false);
          })
          .catch((err) => {
            if (err.isAxiosError) {
              const error = err as AxiosError;
              dispatch(
                sendSystemMessage(
                  error.response?.data.error || error.message,
                  messageSeverity.CRITICAL
                )
              );
            }
          });
      }
    } else if (readyToAppend && !mediaObjects.current.sourceBuffer) {
      setReadyToAppend(false);
    }
  }, [readyToAppend]);

  return (
    <Container>
      <video autoPlay controls ref={videoObject} />
    </Container>
  );
}
