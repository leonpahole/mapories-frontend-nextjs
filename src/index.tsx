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

ReactDOM.render(
  <SnackbarProvider>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </SnackbarProvider>,
  document.getElementById("root")
);
