import React, { lazy, Suspense, useEffect } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { iState } from "../constants/State";

const Container = styled.div`
  width: 100%;
  background: grey;
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VideoPlayer = lazy(() => import("./videoPlayer"));
const Auth = lazy(() => import("./shared/auth"));

export default function App() {
  const shouldShowAuth = useSelector((state: iState) => state.shouldShowLogin);

  return (
    <Container>
      <Navbar />
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
  );
}
