import React, { useState } from "react";
import { Alert, Icon, IconButton } from "rsuite";
import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriendship,
  sendFriendRequest,
} from "../../api/user.api";
import { FriendStatus, UserProfileData } from "../../types/UserProfile";
import { ConfirmDialog } from "../ConfirmDialog";

interface FriendshipButtonProps {
  userProfileData: UserProfileData;
  onChange(friendStatus: FriendStatus): void;
}

export const FriendshipButton: React.FC<FriendshipButtonProps> = ({
  userProfileData,
  onChange,
}) => {
  const [
    showConfirmRemoveFriend,
    setShowConfirmRemoveFriend,
  ] = useState<boolean>(false);

  const onAddFriendClick = async () => {
    try {
      const friendStatus = await sendFriendRequest(userProfileData.id);
      if (friendStatus === FriendStatus.FRIENDS) {
        Alert.success(`You are now friends with ${userProfileData.name}!`);
      } else {
        Alert.success(`Friend request sent to ${userProfileData.name}!`);
      }

      onChange(friendStatus);
    } catch (e) {
      console.log(e);
      Alert.success("Error has occured! Try again.");
    }
  };

  const onAcceptRequestClick = async () => {
    try {
      await acceptFriendRequest(userProfileData.id);
      Alert.success(
        `Friend request accepted! You are now friends with ${userProfileData.name}!`
      );
      onChange(FriendStatus.FRIENDS);
    } catch (e) {
      console.log(e);
      Alert.success("Error has occured! Try again.");
    }
  };

  const onCancelRequestClick = async () => {
    try {
      await cancelFriendRequest(userProfileData.id);
      Alert.success(`Friend request cancelled!`);
      onChange(FriendStatus.NONE);
    } catch (e) {
      console.log(e);
      Alert.success("Error has occured! Try again.");
    }
  };

  const onDeclineRequestClick = async () => {
    try {
      await declineFriendRequest(userProfileData.id);
      Alert.success(`Friend request declined!`);
      onChange(FriendStatus.NONE);
    } catch (e) {
      console.log(e);
      Alert.success("Error has occured! Try again.");
    }
  };

  const onRemoveFriendClick = async () => {
    try {
      await removeFriendship(userProfileData.id);
      Alert.success(
        `Friend removed. You are now no longer friends with ${userProfileData.name}!`
      );
      onChange(FriendStatus.NONE);
      setShowConfirmRemoveFriend(false);
    } catch (e) {
      console.log(e);
      Alert.success("Error has occured! Try again.");
    }
  };

  let friendButton = null;
  if (userProfileData.friendStatus === FriendStatus.NONE) {
    friendButton = (
      <div className="d-flex">
        <IconButton onClick={onAddFriendClick} icon={<Icon icon="user-plus" />}>
          Send friend request
        </IconButton>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.PENDING_FROM_ME) {
    friendButton = (
      <div className="d-flex">
        <IconButton
          color="red"
          onClick={onCancelRequestClick}
          icon={<Icon icon="user-times" />}
        >
          Cancel friend request
        </IconButton>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.PENDING_FROM_THEM) {
    friendButton = (
      <div className="d-flex">
        <IconButton
          className="mr-1"
          color="green"
          onClick={onAcceptRequestClick}
          icon={<Icon icon="check-circle" />}
        >
          Accept friend request
        </IconButton>
        <IconButton
          className="ml-1"
          color="red"
          onClick={onDeclineRequestClick}
          icon={<Icon icon="times-circle" />}
        >
          Decline friend request
        </IconButton>
      </div>
    );
  } else if (userProfileData.friendStatus === FriendStatus.FRIENDS) {
    friendButton = (
      <div className="d-flex">
        <IconButton
          color="red"
          onClick={() => setShowConfirmRemoveFriend(true)}
          icon={<Icon icon="user-times" />}
        >
          Remove friend
        </IconButton>
      </div>
    );
  }

  const confirmRemoveDialog = (
    <ConfirmDialog
      show={showConfirmRemoveFriend}
      onClose={() => setShowConfirmRemoveFriend(false)}
      onConfirm={onRemoveFriendClick}
      header={"Remove friend?"}
      text={"Really remove " + userProfileData.name + " from your friend list?"}
      confirmButtonText={"Yes"}
      confirmButtonColor={"red"}
      cancelButtonText={"No"}
    />
  );

  return (
    <>
      {confirmRemoveDialog}
      {friendButton}
    </>
  );
};
