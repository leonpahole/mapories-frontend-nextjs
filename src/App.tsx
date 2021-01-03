import React, { useEffect, useState } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { refreshToken } from "./api/auth.api";
import ChatSideBar from "./components/chat/ChatSideBar";
import { Loading } from "./components/Loading";
import TopNavBar from "./components/navigation/TopNavBar";
import CreateSocialAccount from "./pages/authentication/CreateSocialAccount";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import ResendVerifyAccountEmail from "./pages/authentication/ResendVerifyAccountEmail";
import ResetPassword from "./pages/authentication/ResetPassword";
import VerifyEmail from "./pages/authentication/VerifyEmail";
import Feed from "./pages/Feed";
import { FriendMap } from "./pages/FriendMap";
import Home from "./pages/Home";
import { NotificationCenter } from "./pages/NotificationCenter";
// import CreateOrUpdatePost from "./pages/CreateOrUpdatePost";
import { PostView } from "./pages/PostView";
import Profile from "./pages/Profile";
// import CreateOrUpdateMapory from "./pages/CreateOrUpdateMapory";
import { SearchResults } from "./pages/SearchResults";
import { loginAction } from "./redux/auth/auth.actions";
import { fetchChatrooms } from "./redux/chat/chat.actions";
import {
  fetchNotifications,
  fetchUnreadNotificationCount,
} from "./redux/notification/notification.actions";
import { useIsLoggedIn } from "./utils/useAlreadyLoggedInGuard";

const BodyContainer = styled.div`
  padding: 40px 20px;
`;

const App: React.FC = () => {
  const { status: themeSwitcherStatus } = useThemeSwitcher();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn] = useIsLoggedIn();

  const [showChat, setShowChat] = useState<boolean>(false);

  useEffect(() => {
    async function tryRefreshTokenAndGetProfile() {
      try {
        const authData = await refreshToken();
        if (authData) {
          dispatch(loginAction(authData));

          dispatch(fetchNotifications(0));
          dispatch(fetchUnreadNotificationCount());

          dispatch(fetchChatrooms());
        }
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    }

    tryRefreshTokenAndGetProfile();
    // eslint-disable-next-line
  }, []);

  if (loading || themeSwitcherStatus === "loading") {
    return <Loading />;
  }

  let routes = null;
  if (isLoggedIn) {
    routes = (
      <>
        <Route path="/profile/:id?">
          <Profile />
        </Route>
        <Route path="/search">
          <SearchResults />
        </Route>
        <Route path="/notification-center">
          <NotificationCenter />
        </Route>
        <Route path="/map">
          <FriendMap />
        </Route>
        <Route path="/post/:id">
          <PostView />
        </Route>
        <Route path="/" exact>
          <Feed />
        </Route>
      </>
    );
  } else {
    routes = (
      <>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/resend-verify-account-email/:email?">
          <ResendVerifyAccountEmail />
        </Route>
        <Route path="/verify-email/:token">
          <VerifyEmail />
        </Route>
        <Route path="/forgot-password">
          <ForgotPassword />
        </Route>
        <Route path="/reset-password/:token">
          <ResetPassword />
        </Route>
        <Route path="/create-social-account">
          <CreateSocialAccount />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
      </>
    );
  }

  return (
    <>
      <Router>
        <TopNavBar onChatToggle={() => setShowChat(!showChat)} />
        {isLoggedIn && (
          <ChatSideBar
            showChat={showChat}
            onCloseChat={() => setShowChat(false)}
          />
        )}
        <BodyContainer>
          <Switch>{routes}</Switch>
        </BodyContainer>
      </Router>
    </>
  );
};

export default App;

/*
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, PointerEvent } from "react-map-gl";
import axios, { AxiosResponse } from "axios";
import LogEntryForm from "./LogEntryForm";

interface Log {
  latitude: number;
  longitude: number;
  id: string;
  title: string;
  description: string;
}

interface Point {
  latitude: number;
  longitude: number;
}


function App() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [showPopup, setShowPopup] = useState<Record<string, boolean>>({});
  const [addEntryLocation, setAddEntryLocation] = useState<Point | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const results: AxiosResponse<Log[]> = await axios.get(
          "http://localhost:4000/log"
        );
        console.log(results);
        setLogs(results.data);
      } catch (e) {
        console.log(e);
        alert("Error");
      }
    };

    fetchPlaces();
  }, []);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 5,
  });

  const showAddMarkerPopup = (e: PointerEvent) => {
    setAddEntryLocation({
      longitude: e.lngLat[0],
      latitude: e.lngLat[1],
    });
  };

  return (
    <ReactMapGL
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      {...viewport}
      mapStyle="mapbox://styles/leonpahole/ckfodrfxh00gy19mwx6nq0foy"
      onViewportChange={(nextViewport) =>
        setViewport({ ...nextViewport, width: "100vw", height: "100vh" })
      }
      onDblClick={showAddMarkerPopup}
    >
      {logs.map((l) => (
        <>
          <Marker key={l.id} latitude={l.latitude} longitude={l.longitude}>
            <div
              onClick={() =>
                setShowPopup({
                  ...showPopup,
                  [l.id]: true,
                })
              }
            >
              <svg
                viewBox="0 0 24 24"
                className="marker"
                stroke="currentColor"
                stroke-width="2.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                style={{
                  width: `${3 * viewport.zoom}px`,
                  height: `${3 * viewport.zoom}px`,
                }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          {showPopup[l.id] && (
            <Popup
              key={l.id}
              latitude={l.latitude}
              longitude={l.longitude}
              closeButton={true}
              closeOnClick={false}
              anchor="top"
              dynamicPosition={true}
              onClose={() => {
                setShowPopup({
                  ...showPopup,
                  [l.id]: false,
                });
              }}
            >
              <div className="popup">
                <h3>{l.title}</h3>
                <p>{l.description}</p>
              </div>
            </Popup>
          )}
        </>
      ))}
      {addEntryLocation && (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <svg
                viewBox="0 0 24 24"
                className="marker"
                stroke="currentColor"
                stroke-width="2.5"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
                style={{
                  width: `${3 * viewport.zoom}px`,
                  height: `${3 * viewport.zoom}px`,
                }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            anchor="top"
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
          >
            <div className="popup">
              <LogEntryForm />
            </div>
          </Popup>
        </>
      )}
    </ReactMapGL>
  );
}
*/
