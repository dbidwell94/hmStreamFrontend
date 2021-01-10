import React from "react";
import styled, { keyframes } from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { iState } from "../../constants/State";

const Container = styled.section`
  position: absolute;
  background: transparent;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

type MessageKeyframeOptions = {
  timeout: number;
};

const messageKeyframe = keyframes`
  from {
    opacity: 100%;
  }

  to {
    opacity: 0%;
  }
`;

const Message = styled.div<MessageKeyframeOptions>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  width: max-content;
  background: whitesmoke;
  color: black;
  padding: 0.75rem 1.25rem;
  animation: ${messageKeyframe} ${(props) => props.timeout / 1000}s linear;
  z-index: 2;
  &.critical {
    background: #ff3d62;
    color: black;
  }
  &.urgent {
    background: #ea971d;
    color: black;
  }
  &.informational {
    background: #69d251;
    color: black;
  }
`;

export default function NotificationCenter() {
  const messages = useSelector((state: iState) => state.systemMessages);
  const dispatch = useDispatch();

  return (
    <Container>
      {messages.map((message) => {
        return (
          <Message
            className={`message ${message.severity.toLowerCase()}`}
            key={message.key}
            timeout={message.totalAliveTime}
          >
            <p>{message.message}</p>
          </Message>
        );
      })}
    </Container>
  );
}
