import React, { lazy, Suspense } from "react";
import styled from "styled-components";
import { Switch, Route } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: grey;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const VideoPlayer = lazy(() => import('./videoPlayer'))

export default function App() {
  return (
    <Container>
      <Switch>
        <Suspense fallback={<h1>Loading</h1>}>
          <Route path="/watch/:vidName">
            <VideoPlayer />
          </Route>
        </Suspense>
      </Switch>
    </Container>
  );
}
