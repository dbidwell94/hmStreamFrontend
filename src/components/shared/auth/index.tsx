import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Container = styled.section`
  display: flex;
  position: fixed;
`;

export default function Auth() {
  return (
    <Container>
      <div>
        <h1>Hello World</h1>
      </div>
    </Container>
  );
}
