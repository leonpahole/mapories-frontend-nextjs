import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import SnackbarProvider from "react-simple-snackbar";

import "./util.css";
import "./shards.override.css";
import "mapbox-gl/dist/mapbox-gl.css";
import ChatSocketProvider from "./socket/ChatSocket";

ReactDOM.render(
  <SnackbarProvider>
    <Provider store={store}>
      <ChatSocketProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChatSocketProvider>
    </Provider>
  </SnackbarProvider>,
  document.getElementById("root")
);
