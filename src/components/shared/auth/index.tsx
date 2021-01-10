import React, { useState } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import Darken from "../DarkenOverlay";
import Login from "./Login";
import Register from "./Register";

interface iContainerOptions {
  primaryColor?: string;
  inversePrimary?: string;
  secondaryColor?: string;
  accentColor?: string;
  errorColor?: string;
}

const Container = styled.section<iContainerOptions>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: ${(props) => props.primaryColor || "white"};
  min-width: 25vw;
  z-index: 1;
  border-radius: 1.25rem;
  .header {
    font-size: 2rem;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: ${(props) => props.secondaryColor || "grey"};
    width: 100%;
    border-top-left-radius: 1.25rem;
    border-top-right-radius: 1.25rem;
    button {
      &:first-child {
        border-top-left-radius: 1.25rem;
      }
      &:last-child {
        border-top-right-radius: 1.25rem;
      }
      all: unset;
      transition: 0.125s ease-in-out all;
      padding: 2rem 0rem;
      cursor: pointer;
      width: 100%;
      height: 100%;
      background: ${(props) => props.secondaryColor || "grey"};
      color: ${(props) => props.primaryColor || "white"};
      text-align: center;
      &:hover {
        background: ${(props) => props.accentColor || "#c9c9ca"};
        color: black;
      }
      &.active {
        background: ${(props) => props.primaryColor || "white"};
        color: ${(props) => props.inversePrimary || "black"};
        cursor: default;
      }
    }
  }
  form {
    color: ${(props) => props.inversePrimary || "black"};
    margin: 5rem 0rem;
    font-size: 1.25rem;
    display: flex;
    flex-direction: column;
    padding: 0rem 2rem;
    label {
      margin: 1rem 0rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      input {
        all: unset;
        cursor: text;
        margin: 0rem 2rem;
        border: none;
        border-bottom: thin solid ${(props) => props.accentColor || "#c9c9ca"};
        padding: 0rem 1rem;
        text-align: center;
        &:focus {
          border-bottom: thin solid
            ${(props) => props.inversePrimary || "black"};
        }
        &.error {
          border-bottom: thin solid ${(props) => props.errorColor || "red"};
        }
      }
    }
    button {
      text-align: center;
      margin-top: 2rem;
      box-shadow: 0rem 0rem 0.125rem ${(props) => props.primaryColor || "black"};
    }
  }
`;

enum forms {
  login,
  register,
}

export default function Auth() {
  const [formToShow, setFormToShow] = useState(forms.login);

  function getForm() {
    switch (formToShow) {
      case forms.login:
        return <Login />;
      case forms.register:
        return <Register />;
      default:
        return <></>;
    }
  }

  function changeActiveTabTo(
    tab: forms,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();
    setFormToShow(tab);
  }

  return (
    <Darken>
      <Container>
        <div className="header">
          <button
            className={formToShow === forms.login ? "active" : ""}
            onClick={(e) => changeActiveTabTo(forms.login, e)}
          >
            Login
          </button>
          <button
            className={formToShow === forms.register ? "active" : ""}
            onClick={(e) => changeActiveTabTo(forms.register, e)}
          >
            Register
          </button>
        </div>
        {getForm()}
      </Container>
    </Darken>
  );
}
