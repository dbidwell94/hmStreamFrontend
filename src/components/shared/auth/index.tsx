import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

const Container = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: white;
  padding: 25rem;
  min-height: 50vh;
  max-height: 100vh;
  min-width: 50vw;
`;

export default function Auth() {

  const {errors, register, handleSubmit, formState} = useForm();

  function sub(data: any) {

  }

  return (
    <Container>
      <form onSubmit={handleSubmit(sub)}>
        
      </form>
    </Container>
  );
}
