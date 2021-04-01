import React from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Authenticated } from "./authenticated";
import { Unauthenticated } from "./unauthenticated";

export const Navbar: React.FC = () => {
  return (
    <Menu size="large" style={{ marginBottom: "50px" }}>
      <NavLink exact to="/posts" className="item">
        posts
      </NavLink>
      <Unauthenticated>
        <NavLink exact to="/enter" className="item">
          enter
        </NavLink>
      </Unauthenticated>
      <Authenticated>
        <NavLink exact to="/create-post" className="item">
          create post
        </NavLink>
        <NavLink exact to="/me" className="item">
          profile
        </NavLink>
      </Authenticated>
    </Menu>
  );
};
