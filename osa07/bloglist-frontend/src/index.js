import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import notificationReducer from "./reducers/notificationReducer";
import blogReducer from "./reducers/blogReducer";
import errorMsgReducer from "./reducers/errorMsgReducer";
import loginReducer from "./reducers/loginReducer";
import userReducer from "./reducers/userReducer";

import { BrowserRouter as Router } from "react-router-dom";

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    errormsg: errorMsgReducer,
    login: loginReducer,
    users: userReducer
  }
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router><App /></Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
