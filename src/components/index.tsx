import React from "react";
import styled from "styled-components";
import VideoPlayer from "./videoPlayer";

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

export default function App() {
  return (
    <Container>
      <VideoPlayer />
    </Container>
  );
}
