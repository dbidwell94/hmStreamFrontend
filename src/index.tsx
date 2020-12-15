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
import { iState } from "./constants/State";
import iAction from "./constants/Action";

const store = createStore(
  baseReducer as Reducer<iState, iAction>,
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
