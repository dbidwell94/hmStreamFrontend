import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import breakpoints from "../constants/Breakpoints";

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
  background: black;
  color: white;
  @media (min-width: 100px) {
  }
  .title {
    h1 {
      font-size: 2.5rem;
    }
  }
  .links {
    a {
      margin: 0rem 0rem 0rem 1rem;
      :first-child {
        margin: 0;
      }
    }
  }
`;

export default function Navbar() {
  return (
    <Container>
      <div className="title">
        <h1>HMStream</h1>
      </div>
      <div className="links">
        <Link to="/movies">Movies</Link>
        <Link to="/" className="cta">
          Login
        </Link>
      </div>
    </Container>
  );
}
