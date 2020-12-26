import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";

import "./util.css";
import "./bootstrap.min.css";
import "mapbox-gl/dist/mapbox-gl.css";

import ChatSocketProvider from "./socket/ChatSocket";
import NotificationSocketProvider from "./socket/NotificationSocket";

require("typeface-raleway");

const themes = {
  light: `${process.env.PUBLIC_URL}/rsuite-default.min.css`,
  dark: `${process.env.PUBLIC_URL}/rsuite-dark.min.css`,
};

ReactDOM.render(
  <ThemeSwitcherProvider defaultTheme="light" themeMap={themes}>
    <Provider store={store}>
      <ChatSocketProvider>
        <NotificationSocketProvider>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </NotificationSocketProvider>
      </ChatSocketProvider>
    </Provider>
  </ThemeSwitcherProvider>,
  document.getElementById("root")
);
