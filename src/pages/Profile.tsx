import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { getUserProfile } from "../api/user.api";
import { Loading } from "../components/Loading";
import { FriendRequests } from "../components/profileTabs/friendRequests";
import { Friends } from "../components/profileTabs/friends";
import { ManageAccount } from "../components/profileTabs/ManageAccount";
import { UserMap } from "../components/profileTabs/userMap";
import { UserPostsList } from "../components/profileTabs/userPostsList";
import { FriendshipButton } from "../components/users/FriendshipButton";
import { ProfileTab, ProfileTabsNav } from "../components/users/ProfileTabsNav";
import { useLoggedInUser } from "../hooks/useLoggedInUser";
import { FriendStatus, UserProfileData } from "../types/UserProfile";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Profile: React.FC = () => {
  const history = useHistory();
  const loggedInUser = useLoggedInUser();

  let { id } = useParams<{ id?: string }>();

  const [selectedTab, setSelectedTab] = useState<ProfileTab>("feed");
  const [
    userProfileData,
    setUserProfileData,
  ] = useState<UserProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    async function tryGetProfile() {
      try {
        const userProfile = await getUserProfile(id ? id : loggedInUser!.id);
        setUserProfileData(userProfile);
        setSelectedTab("feed");
      } catch (e) {
        console.log(e);
      }

      setLoadingProfile(false);
    }

    if (id === loggedInUser!.id) {
      history.replace("/profile");
    } else {
      tryGetProfile();
    }
  }, [id]);

  const selectTab = (tab: ProfileTab) => {
    console.log(tab);
    setSelectedTab(tab);
  };

  if (loadingProfile) {
    return <Loading />;
  }

  if (userProfileData == null) {
    return <div>Not found</div>;
  }

  const isMe = userProfileData.friendStatus === FriendStatus.IS_ME;
  const areFriends = userProfileData.friendStatus === FriendStatus.FRIENDS;

  let selectedTabContent = null;
  if (selectedTab === "map") {
    selectedTabContent = <UserMap userId={userProfileData.id} />;
  } else if (selectedTab === "feed") {
    selectedTabContent = <UserPostsList userId={userProfileData.id} />;
  } else if (selectedTab === "friends") {
    selectedTabContent = <Friends />;
  } else if (selectedTab === "friend-requests") {
    selectedTabContent = <FriendRequests />;
  } else if (selectedTab === "manage") {
    selectedTabContent = <ManageAccount />;
  }

  return (
    <ProfileContainer>
      <img
        style={{
          border: "2px solid black",
          width: "130px",
          height: "130px",
          borderRadius: "50%",
        }}
        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
      />

      <h3>{userProfileData.name}</h3>

      {!isMe && (
        <div className="mt-2">
          <FriendshipButton
            userProfileData={userProfileData}
            onChange={(friendStatus: FriendStatus) => {
              setUserProfileData((up) => {
                return { ...up!, friendStatus };
              });
            }}
          />
        </div>
      )}

      {(areFriends || isMe) && (
        <div className="mt-3" style={{ width: "100%" }}>
          <ProfileTabsNav
            isMe={isMe}
            onSelect={selectTab}
            appearance="subtle"
            active={selectedTab}
          />
          <div className="mt-5" style={{ width: "100%" }}>
            {selectedTabContent}
          </div>
        </div>
      )}
    </ProfileContainer>
  );
};

export default Profile;
