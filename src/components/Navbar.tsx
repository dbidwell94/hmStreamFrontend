import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import breakpoints from "../constants/Breakpoints";
import { useSelector, useDispatch } from "react-redux";
import { iState } from "../constants/State";
import { toggleAuth, logout } from "../actions";

const Container = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  padding: 0rem 2.5rem;
  top: 0;
  left: 0;
  height: 6rem;
  width: 100%;
  background: #464646;
  color: white;
  .title {
    h1 {
      font-size: 2.5rem;
    }
  }
  .links {
    a,
    button {
      margin: 0rem 0rem 0rem 1rem;
      :first-child {
        margin: 0;
      }
    }
  }
`;

export default function Navbar() {
  const auth = useSelector((state: iState) => state.authentication);

  const dispatch = useDispatch();

  function handleLoginClick(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();
    dispatch(toggleAuth());
  }

  function handleLogoutClick(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    evt.preventDefault();
    dispatch(logout());
  }

  return (
    <Container>
      <div className="title">
        <h1>HMStream</h1>
      </div>
      <div className="links">
        <Link to="/library">Library</Link>
        {auth.userId === null ? (
          <button className="cta" onClick={handleLoginClick}>
            Login
          </button>
        ) : (
          <button onClick={handleLogoutClick}>Logout</button>
        )}
      </div>
    </Container>
  );
}
