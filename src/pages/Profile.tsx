import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { UserProfileData } from "../types/UserProfile";
import Avatar from "react-avatar";
import { Nav, NavItem, NavLink } from "shards-react";
import { UserMap } from "../components/profileTabs/userMap";
import { UserProfile } from "../components/profileTabs/userProfile";
import { UserMaporiesList } from "../components/profileTabs/userMaporiesList";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootStore } from "../redux/store";
import { Loading } from "../components/Loading";
import { getUserProfile } from "../api/user.api";

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
  PROFILE: {
    name: "PROFILE",
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
        const userProfile = await getUserProfile(id);
        setUserProfileData(userProfile);
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

  let selectedTabContent = null;
  if (selectedTab === NavLinks.MAP.name) {
    selectedTabContent = <UserMap userId={loggedInUser!.id} />;
  } else if (selectedTab === NavLinks.MEMORIES.name) {
    selectedTabContent = <UserMaporiesList userId={loggedInUser!.id} />;
  } else if (selectedTab === NavLinks.PROFILE.name) {
    selectedTabContent = <UserProfile userProfileData={userProfileData} />;
  }

  return (
    <ProfileContainer>
      <Avatar
        round
        maxInitials={3}
        // src={loggedInUser!.profilePictureUrl}
        name={loggedInUser!.name}
      />

      <h4>{loggedInUser!.name}</h4>

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
            active={selectedTab === NavLinks.PROFILE.name}
            onClick={() => selectTab(NavLinks.PROFILE)}
          >
            {NavLinks.PROFILE.name}
          </NavLink>
        </NavItem>
      </Nav>
      {selectedTabContent}
    </ProfileContainer>
  );
};

export default Profile;
