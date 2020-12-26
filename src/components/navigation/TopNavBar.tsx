import React, { useEffect } from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Badge, Icon, Nav, Navbar, Tooltip, Whisper } from "rsuite";
import styled from "styled-components";
import { logout } from "../../api/auth.api";
import { Breakpoints } from "../../constants/breakpoints";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import { logoutAction } from "../../redux/auth/auth.actions";
import { clearChatData } from "../../redux/chat/chat.actions";
import { clearNotificationData } from "../../redux/notification/notification.actions";
import { RootStore } from "../../redux/store";
import { NotificationBell } from "../notification/NotificationBell";
import { UserSearchBar } from "../users/UserSearchBar";

const IS_DARK_MODE_KEY = "dark_mode";

const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: cover;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  padding: 18px 16px;
`;

const LogoText = styled.h5`
  margin-left: 10px;
`;

const NavbarBody = styled(Navbar.Body)`
  @media (max-width: ${Breakpoints.mobile}) {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

interface TopNavBarProps {
  onChatToggle(): void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ onChatToggle }) => {
  const { switcher, themes } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const loggedInUser = useLoggedInUser();

  const dispatch = useDispatch();
  const history = useHistory();

  const unreadChatsCount = useSelector(
    (state: RootStore) => state.chats.unreadCount
  );

  useEffect(() => {
    const isDarkMode = localStorage.getItem(IS_DARK_MODE_KEY);
    if (isDarkMode && isDarkMode === "1") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const setDarkMode = (darkMode: boolean) => {
    switcher({ theme: darkMode ? themes.dark : themes.light });
    setIsDarkMode(darkMode);
    localStorage.setItem(IS_DARK_MODE_KEY, darkMode ? "1" : "0");
  };

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const uiModeTooltip = (
    <Tooltip>{isDarkMode ? "Light mode" : "Dark mode"}</Tooltip>
  );

  const onLogout = async () => {
    try {
      await logout();
      dispatch(clearNotificationData());
      dispatch(clearChatData());
    } catch (e) {
      console.log("Logout error");
      console.log(e);
    }

    dispatch(logoutAction());
    history.push("/login");
  };

  let navData = null;
  if (loggedInUser) {
    navData = (
      <>
        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={<Tooltip>Chat</Tooltip>}
        >
          <Nav.Item
            onClick={() => onChatToggle()}
            icon={
              <Badge
                content={unreadChatsCount > 0 ? unreadChatsCount : false}
                maxCount={9}
              >
                <Icon icon="commenting-o" />
              </Badge>
            }
          ></Nav.Item>
        </Whisper>

        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={<Tooltip>Map</Tooltip>}
        >
          <Nav.Item
            componentClass={Link}
            to="/map"
            icon={<Icon icon="globe" />}
          ></Nav.Item>
        </Whisper>

        <NotificationBell />

        <Nav.Item
          componentClass={Link}
          to="/profile"
          icon={<Icon icon="user" />}
        >
          {loggedInUser.name}
        </Nav.Item>

        <Whisper
          placement="bottom"
          trigger="hover"
          speaker={<Tooltip>Sign out</Tooltip>}
        >
          <Nav.Item
            onClick={onLogout}
            icon={<Icon icon="sign-out" />}
          ></Nav.Item>
        </Whisper>
      </>
    );
  } else {
    navData = (
      <>
        <Nav.Item
          componentClass={Link}
          to="/login"
          icon={<Icon icon="sign-in" />}
        >
          Sign in
        </Nav.Item>

        <Nav.Item
          componentClass={Link}
          to="/register"
          icon={<Icon icon="user-plus" />}
        >
          Create an account
        </Nav.Item>
      </>
    );
  }

  return (
    <Navbar appearance="subtle">
      <NavbarBody>
        <Nav>
          <LogoContainer>
            <Link to="/">
              <LogoImage src="images/logo_transparent_no_text.png" />
            </Link>
            <Link to="/" className="no-style-link">
              <LogoText>Mapories</LogoText>
            </Link>
            {loggedInUser && (
              <div style={{ marginLeft: "20px" }}>
                <UserSearchBar />
              </div>
            )}
          </LogoContainer>
        </Nav>
        <Nav pullRight>
          {navData}
          <Whisper placement="bottom" trigger="hover" speaker={uiModeTooltip}>
            <Nav.Item
              onClick={toggleDarkMode}
              icon={<Icon icon={isDarkMode ? "sun-o" : "moon-o"} />}
            ></Nav.Item>
          </Whisper>
        </Nav>
      </NavbarBody>
    </Navbar>
  );
};

export default TopNavBar;
