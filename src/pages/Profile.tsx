import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { UserProfileData, FriendStatus } from "../types/UserProfile";
import Avatar from "react-avatar";
import { Nav, NavItem, NavLink, Button } from "shards-react";
import { UserMap } from "../components/profileTabs/userMap";
import { UserProfile } from "../components/profileTabs/userProfile";
import { UserMaporiesList } from "../components/profileTabs/userMaporiesList";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootStore } from "../redux/store";
import { Loading } from "../components/Loading";
import {
  getUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriendship,
  cancelFriendRequest,
} from "../api/user.api";
import { FriendRequests } from "../components/profileTabs/friendRequests";
import { Friends } from "../components/profileTabs/friends";
import { UserPostsList } from "../components/profileTabs/userPostsList";

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface NavLinkInfo {
  name: string;
}

const NavLinks: Record<string, NavLinkInfo> = {
  MAP: {
    name: "MAP",
  },
  MEMORIES: {
    name: "MAPORIES",
  },
  POSTS: {
    name: "POSTS",
  },
  PROFILE: {
    name: "PROFILE",
  },
  FRIEND_REQUESTS: {
    name: "FRIEND REQUESTS",
  },
  FRIENDS: {
    name: "FRIENDS",
  },
};

const Profile: React.FC = () => {
  const loggedInUser = useSelector(
    (state: RootStore) => state.auth.loggedInUser
  );

  let { id } = useParams();

  const [selectedTab, setSelectedTab] = useState<string>(NavLinks.MAP.name);
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
        setSelectedTab(NavLinks.MAP.name);
      } catch (e) {
        console.log(e);
      }

      setLoadingProfile(false);
    }

    tryGetProfile();
  }, [id]);

  const selectTab = (link: NavLinkInfo) => {
    setSelectedTab(link.name);
  };

  if (loadingProfile) {
    return <Loading />;
  }

  if (userProfileData == null) {
    return <div>Not found</div>;
  }

  const isMe = userProfileData.friendStatus === FriendStatus.IS_ME;

  const onAddFriendClick = async () => {
    try {
      const friendStatus = await sendFriendRequest(userProfileData.id);
      if (friendStatus === FriendStatus.FRIENDS) {
        alert("You are now friends!");
      } else {
        alert("Friend request sent!");
      }

      setUserProfileData((up) => {
        return { ...up!, friendStatus };
      });
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  const onAcceptRequestClick = async () => {
    try {
      await acceptFriendRequest(userProfileData.id);
      alert("Acccept!");
      setUserProfileData((up) => {
        return { ...up!, friendStatus: FriendStatus.FRIENDS };
      });
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  const onCancelRequestClick = async () => {
    try {
      await cancelFriendRequest(userProfileData.id);
      alert("Cancel!");
      setUserProfileData((up) => {
        return { ...up!, friendStatus: FriendStatus.NONE };
      });
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  const onDeclineRequestClick = async () => {
    try {
      await declineFriendRequest(userProfileData.id);
      alert("Declined!");
      setUserProfileData((up) => {
        return { ...up!, friendStatus: FriendStatus.NONE };
      });
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  const onRemoveFriendClick = async () => {
    try {
      await removeFriendship(userProfileData.id);
      alert("Removed!");
      setUserProfileData((up) => {
        return { ...up!, friendStatus: FriendStatus.NONE };
      });
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  let selectedTabContent = null;
  if (selectedTab === NavLinks.MAP.name) {
    selectedTabContent = <UserMap userId={userProfileData.id} />;
  } else if (selectedTab === NavLinks.MEMORIES.name) {
    selectedTabContent = <UserMaporiesList userId={userProfileData.id} />;
  } else if (selectedTab === NavLinks.POSTS.name) {
    selectedTabContent = <UserPostsList userId={userProfileData.id} />;
  } else if (selectedTab === NavLinks.PROFILE.name) {
    selectedTabContent = (
      <UserProfile userProfileData={userProfileData} isMe={isMe} />
    );
  } else if (selectedTab === NavLinks.FRIEND_REQUESTS.name) {
    selectedTabContent = <FriendRequests />;
  } else if (selectedTab === NavLinks.FRIENDS.name) {
    selectedTabContent = <Friends />;
  }

  let friendButton = null;
  if (userProfileData.friendStatus === FriendStatus.NONE) {
    friendButton = (
      <div className="d-flex">
        <Button onClick={onAddFriendClick}>Add friend</Button>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.PENDING_FROM_ME) {
    friendButton = (
      <div className="d-flex">
        <Button onClick={onCancelRequestClick}>Cancel friend request</Button>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.PENDING_FROM_THEM) {
    friendButton = (
      <div className="d-flex">
        <Button onClick={onAcceptRequestClick}>Accept friend request</Button>
        <Button onClick={onDeclineRequestClick}>Decline friend request</Button>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.FRIENDS) {
    friendButton = (
      <div className="d-flex">
        <Button onClick={onRemoveFriendClick}>Remove friend</Button>
      </div>
    );
  }

  return (
    <ProfileContainer>
      <Avatar
        round
        maxInitials={3}
        // src={userProfileData.profilePictureUrl}
        name={userProfileData.name}
      />

      <h4>
        {userProfileData.name} {isMe ? "(Me)" : ""}
      </h4>

      {!isMe && <div className="mt-1 mb-3">{friendButton}</div>}

      <Nav pills className="mb-2">
        <NavItem>
          <NavLink
            className="c-pointer"
            active={selectedTab === NavLinks.MAP.name}
            onClick={() => selectTab(NavLinks.MAP)}
          >
            {NavLinks.MAP.name}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className="c-pointer"
            active={selectedTab === NavLinks.MEMORIES.name}
            onClick={() => selectTab(NavLinks.MEMORIES)}
          >
            {NavLinks.MEMORIES.name}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className="c-pointer"
            active={selectedTab === NavLinks.POSTS.name}
            onClick={() => selectTab(NavLinks.POSTS)}
          >
            {NavLinks.POSTS.name}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className="c-pointer"
            active={selectedTab === NavLinks.PROFILE.name}
            onClick={() => selectTab(NavLinks.PROFILE)}
          >
            {NavLinks.PROFILE.name}
          </NavLink>
        </NavItem>
        {isMe && (
          <>
            <NavItem>
              <NavLink
                className="c-pointer"
                active={selectedTab === NavLinks.FRIEND_REQUESTS.name}
                onClick={() => selectTab(NavLinks.FRIEND_REQUESTS)}
              >
                {NavLinks.FRIEND_REQUESTS.name}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className="c-pointer"
                active={selectedTab === NavLinks.FRIENDS.name}
                onClick={() => selectTab(NavLinks.FRIENDS)}
              >
                {NavLinks.FRIENDS.name}
              </NavLink>
            </NavItem>
          </>
        )}
      </Nav>
      {selectedTabContent}
    </ProfileContainer>
  );
};

export default Profile;
