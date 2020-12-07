import React, { useEffect } from "react";
import { Navbar, Nav, Icon, Whisper, Tooltip } from "rsuite";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Breakpoints } from "../../constants/breakpoints";

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

const TopNavBar: React.FC = () => {
  const { switcher, themes } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem(IS_DARK_MODE_KEY);
    if (isDarkMode && isDarkMode === "1") {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  const setDarkMode = (darkMode: boolean) => {
    console.log(darkMode);
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
          </LogoContainer>
        </Nav>
        <Nav pullRight>
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
