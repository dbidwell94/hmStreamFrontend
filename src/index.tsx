import React from "react";
import ReactDOM from "react-dom";
import App from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import baseReducer from "./reducer/baseReducer";
import thunk from "redux-thunk";
import logger from "redux-logger";
import "./less/index.less";

const isDevelopment = !process.env.NODE_ENV?.toLowerCase().includes(
  "production"
);
console.log(process.env);

const store = isDevelopment
  ? createStore(baseReducer, applyMiddleware(thunk, logger))
  : createStore(baseReducer, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector("#root")
);
