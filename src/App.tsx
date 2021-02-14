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

          dispatch(fetchNotifications(undefined));
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
