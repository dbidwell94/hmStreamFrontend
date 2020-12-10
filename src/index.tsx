import React from "react";
import ReactDOM from "react-dom";
import App from "./components";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import {createStore, applyMiddleware, Reducer} from 'redux';
import baseReducer from './reducer/baseReducer';
import thunk from 'redux-thunk';
import "./index.less";
import State from "./constants/State";

const store = createStore(baseReducer as Reducer<State>, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.querySelector("#root")
);
