import React from "react";
import ReactDOM from "react-dom";
import App from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, Reducer } from "redux";
import baseReducer from "./reducer/baseReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import "./less/index.less";

const store = createStore(
  baseReducer,
  applyMiddleware(thunk, logger)
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector("#root")
);
