import React, { lazy, Suspense, useEffect } from "react";
import styled from "styled-components";
import { Switch } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector, useDispatch } from "react-redux";
import { iState } from "../constants/State";
import PrivateRoute from "./shared/PrivateRoute";
import NotificationCenter from "./shared/NotificationCenter";
import { setMediaServerAddress } from "../actions";
import VideoPlayer from './videoPlayer';

const Container = styled.div`
  width: 100%;
  background: black;
  min-height: calc(100vh - 6rem);
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
`;

const Auth = lazy(() => import("./shared/auth"));

export default function App() {
  const shouldShowAuth = useSelector((state: iState) => state.shouldShowLogin);
  const dispatch = useDispatch();
  const auth = useSelector((state: iState) => state.authentication);

  return (
    <React.Fragment>
      <Navbar />
      <NotificationCenter />
      <Container>
        {shouldShowAuth && (
          <Suspense fallback={<h1>Loading...</h1>}>
            <Auth />
          </Suspense>
        )}
        <Switch>
          <PrivateRoute path="/watch/:vidName" redirectTo="/">
            <VideoPlayer />
          </PrivateRoute>
        </Switch>
      </Container>
    </React.Fragment>
  );
}
