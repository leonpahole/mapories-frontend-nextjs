import React from "react";
import { UserMap } from "../components/profileTabs/userMap";

export const FriendMap: React.FC = () => {
  return (
    <div>
      <h3 className="mb-3">Activity map</h3>
      <UserMap />
    </div>
  );
};
