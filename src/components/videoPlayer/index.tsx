import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iState } from "../../constants/State";
import VideoPlayer from "./player";
import styled from "styled-components";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { sendSystemMessage, setMediaServerAddress } from "../../actions";
import { messageSeverity } from "../../constants/Types";

const Loader = styled.div`
  background: transparent;
  display: flex;
  font-size: 2rem;
  width: 100%;
  height: calc(100vh - 6rem);
  justify-content: center;
  align-items: center;
  p {
    color: white;
  }
`;

export default function VideoPlayerLoader() {
  const ipAddress = useSelector((state: iState) => state.mediaServerIpAddress);

  const token = useSelector((state: iState) => state.authentication.token);
  const dispatch = useDispatch();

  const [readyToLoad, setReadyToLoad] = useState(false);

  useEffect(() => {
    async function checkIpAddress() {
      if (token) {
        try {
          const remoteUrl = await axios.get<{ address: string; id: number }>(
            `${BACKEND_URL}/api/addresses/address`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const port = remoteUrl.data.address.split(":")[1];
          try {
            const localResponse = await (
              await axios.get<{ status?: string }>(`https://localhost:${port}`)
            ).data;
            if ("status" in localResponse) {
              dispatch(setMediaServerAddress(`localhost:${port}`));
              setReadyToLoad(true);
            }
          } catch (err) {
            console.log(`Logging error: ${err}`);
            try {
              console.log("trying other server");
              const remoteResponse = await (
                await axios.get(`https://${remoteUrl.data.address}`, {})
              ).data;
              if ("status" in remoteResponse) {
                dispatch(setMediaServerAddress(remoteUrl.data.address));
                setReadyToLoad(true);
              }
            } catch (err) {
              dispatch(
                sendSystemMessage(
                  "Unable to connect to media server",
                  messageSeverity.CRITICAL
                )
              );
            }
          }
        } catch (err) {
          dispatch(
            sendSystemMessage(
              "HMStream is down, please try again later",
              messageSeverity.CRITICAL
            )
          );
        }
      }
    }

    checkIpAddress();
  }, [token]);

  return (
    <>
      {readyToLoad ? (
        <VideoPlayer />
      ) : (
        <Loader>
          <p>Loading...</p>
        </Loader>
      )}
    </>
  );
}
