import React from "react";
import ReactDOM from "react-dom";
import App from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.less";

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.querySelector("#root")
);
