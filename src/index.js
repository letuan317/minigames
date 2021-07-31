import App from "./App";
import rootReducers from "chat/store/reducer/index";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import React from "react";
import { Provider } from "react-redux";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore(rootReducers);
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
