import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendSystemMessage } from "../../actions";
import { messageSeverity, iServerError } from "../../constants/Types";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getBytes, stringToUint8Arr, MAX_BYTE_SIZE } from "../../utils/byteUtils";

interface iVideoDetails {
  VideoSize: number;
  VideoName: string;
}

interface iVideoRouterParam {
  vidName: string;
}

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

  const videoObject = useRef(null) as MutableRefObject<null | HTMLVideoElement>;
  const mediaSource = useRef(new MediaSource());

  const [videoDetails, setVideoDetails] = useState(
    null as iVideoDetails | null
  );

  useEffect(() => {
    axios
      .get(`http://localhost:2019/video/${vidName}.webm/size`)
      .then((res: AxiosResponse<iVideoDetails | null>) => {
        setVideoDetails(res.data);
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
    if (videoDetails) {
      getBytes({
        endingAt: MAX_BYTE_SIZE,
        startingAt: 0,
        fileName: videoDetails.VideoName,
      })
        .then((res) => {
          console.log(stringToUint8Arr(res.VideoData));
        })
        .catch((err: AxiosError<iServerError>) => {
          dispatch(
            sendSystemMessage(
              err.response?.data.message || err.message,
              messageSeverity.CRITICAL
            )
          );
        });
    }
  }, [videoDetails]);

  return (
    <Container>
      <video autoPlay ref={videoObject} />
    </Container>
  );
}
