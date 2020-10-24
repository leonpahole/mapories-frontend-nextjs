import React from "react";
import { UserProfileData } from "../../types/UserProfile";

interface UserProfileProps {
  userProfileData: UserProfileData;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userProfileData: userProfile,
}) => {
  return (
    <div>
      <p>
        <b>Display name:</b> {userProfile.name}
      </p>
    </div>
  );
};
