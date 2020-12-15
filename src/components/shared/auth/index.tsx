import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Darken from "../DarkenOverlay";

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: white;
  padding: 25rem;
  min-height: 50vh;
  max-height: 100vh;
  min-width: 50vw;
  form {
    display: flex;

  }
`;

export default function Auth() {
  const { errors, register, handleSubmit, formState } = useForm();

  function sub(data: any) {}

  return (
    <Darken>
      <Container>
        <form onSubmit={handleSubmit(sub)}></form>
        
      </Container>
    </Darken>
  );
}
