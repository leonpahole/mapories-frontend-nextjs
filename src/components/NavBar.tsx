import React, { useState } from "react";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
} from "shards-react";
import { NavLink as Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../redux/store";
import { logoutAction } from "../redux/auth/auth.actions";
import { logout } from "../api/auth.api";

interface NavLinkItem {
  link?: string;
  text: string;
}

const renderNavLinks = (links: NavLinkItem[]) => {
  return links.map((l) => (
    <NavItem>
      <Link to={l.link ? l.link : "#"}>
        <NavLink>{l.text}</NavLink>
      </Link>
    </NavItem>
  ));
};

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  const [collapseOpen, setCollapseOpen] = useState<boolean>(false);
  const toggleCollapse = () => {
    setCollapseOpen((o) => !o);
  };

  const onLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Logout error");
      console.log(e);
    }

    dispatch(logoutAction());
    history.push("/login");
  };

  const isLoggedIn = !!loggedInUser;

  let navLinks: NavLinkItem[] = [];

  if (isLoggedIn) {
    navLinks = [
      {
        text: "My map",
        link: "/map",
      },
    ];
  } else {
    navLinks = [
      {
        text: "Login",
        link: "/login",
      },
      {
        text: "Register",
        link: "/register",
      },
    ];
  }

  let loggedInItems = null;
  if (isLoggedIn) {
    loggedInItems = (
      <>
        <NavItem>
          <Link to="/profile">
            <NavLink>Logged in as {loggedInUser!.name}</NavLink>
          </Link>
        </NavItem>
        <NavItem>
          <NavLink className="c-pointer" onClick={onLogout}>
            Logout
          </NavLink>
        </NavItem>
      </>
    );
  }

  return (
    <Navbar type="dark" theme="primary" expand="md">
      <Link to="/">
        <NavbarBrand>Map'o'ries</NavbarBrand>
      </Link>
      <NavbarToggler onClick={toggleCollapse} />

      <Collapse open={collapseOpen} navbar>
        <Nav navbar></Nav>

        <Nav navbar className="ml-auto">
          {renderNavLinks(navLinks)}
          {loggedInItems}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
