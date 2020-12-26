import React from "react";
import { Nav } from "rsuite";

export type ProfileTab =
  | "feed"
  | "map"
  | "profile-details"
  | "friends"
  | "friend-requests"
  | "manage";

export const ProfileTabsNav = ({ active, onSelect, isMe, ...props }: any) => {
  return (
    <Nav {...props} activeKey={active} onSelect={onSelect}>
      <Nav.Item eventKey="feed" className="mr-1 ml-1">
        Feed
      </Nav.Item>
      <Nav.Item eventKey="map" className="mr-1 ml-1">
        Map
      </Nav.Item>
      {isMe && (
        <Nav.Item eventKey="friends" className="mr-1 ml-1">
          Friends
        </Nav.Item>
      )}
      {isMe && (
        <Nav.Item eventKey="friend-requests" className="mr-1 ml-1">
          Friend requests
        </Nav.Item>
      )}
      {isMe && (
        <Nav.Item eventKey="manage" className="mr-1 ml-1">
          Manage account
        </Nav.Item>
      )}
    </Nav>
  );
};
