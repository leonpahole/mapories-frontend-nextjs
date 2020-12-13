import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink as Link, useHistory } from "react-router-dom";
import {
  Button,
  Collapse,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from "shards-react";
import { logout } from "../api/auth.api";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { logoutAction } from "../redux/auth/auth.actions";
import { useQuery } from "../utils/useQuery";

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
  const query = useQuery();
  const loggedInUser = useLoggedInUser();

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

  const [searchString, setSearchString] = useState<string>(
    query.get("q") || ""
  );

  const doSearch = () => {
    history.push(`/search?q=${searchString.trim()}`);
  };

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

  if (2 > 1) {
    return null;
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
        <Nav navbar>
          {isLoggedIn && (
            <div className="d-flex justify-content-center align-items-center">
              <InputGroup size="sm" seamless>
                <InputGroupAddon type="prepend">
                  <InputGroupText></InputGroupText>
                </InputGroupAddon>
                <FormInput
                  value={searchString}
                  onChange={(e: any) => setSearchString(e.target.value)}
                  className="border-0"
                  placeholder="Search..."
                />
              </InputGroup>
              <Button
                disabled={searchString.trim().length === 0}
                onClick={doSearch}
                theme="light"
                className="ml-2"
              >
                Search
              </Button>
            </div>
          )}
        </Nav>

        <Nav navbar className="ml-auto">
          {renderNavLinks(navLinks)}
          {loggedInItems}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default NavBar;
