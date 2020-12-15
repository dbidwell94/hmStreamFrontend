import React, { lazy, Suspense, useEffect } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { iState } from "../constants/State";

const Container = styled.div`
  width: 100%;
  background: black;
  min-height: calc(100vh - 6rem);
  margin-top: 6rem;
  display: flex;
  flex-direction: column;
`;

const VideoPlayer = lazy(() => import("./videoPlayer"));
const Auth = lazy(() => import("./shared/auth"));

export default function App() {
  const shouldShowAuth = useSelector((state: iState) => state.shouldShowLogin);

  return (
    <React.Fragment>
      <Navbar />
      <Container>
        {shouldShowAuth && (
          <Suspense fallback={<h1>Loading...</h1>}>
            <Auth />
          </Suspense>
        )}
        <Switch>
          <Suspense fallback={<h1>Loading...</h1>}>
            <Route path="/watch/:vidName">
              <VideoPlayer />
            </Route>
          </Suspense>
        </Switch>
      </Container>
    </React.Fragment>
  );
}
