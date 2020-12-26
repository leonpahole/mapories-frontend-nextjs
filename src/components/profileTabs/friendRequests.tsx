import React, { useEffect, useState } from "react";
import { Alert } from "rsuite";
import {
  acceptFriendRequest,
  declineFriendRequest,
  getFriendRequests,
} from "../../api/user.api";
import { UserExcerpt } from "../../types/UserExcerpt";
import { Loading } from "../Loading";
import { UserList } from "../users/UserList";

export const FriendRequests: React.FC<{}> = () => {
  const [requests, setRequests] = useState<UserExcerpt[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const fRequests = await getFriendRequests();
        setRequests(fRequests.map((fr) => fr.from));
      } catch (e) {
        console.log(e);
      }

      setLoadingRequests(false);
    }

    fetchRequests();
  }, []);

  const removeFriendRequest = (userId: string) => {
    setRequests((r) => r.filter((r1) => r1.id !== userId));
  };

  const onAcceptRequestClick = async (userId: string) => {
    try {
      await acceptFriendRequest(userId);
      removeFriendRequest(userId);
      Alert.info(`Request accepted! You are now friends.`);
    } catch (e) {
      console.log(e);
      Alert.error("And error occured. Try again.");
    }
  };

  const onDeclineRequestClick = async (userId: string) => {
    try {
      await declineFriendRequest(userId);
      removeFriendRequest(userId);
      Alert.info("Request declined.");
    } catch (e) {
      console.log(e);
      Alert.error("And error occured. Try again.");
    }
  };

  if (loadingRequests) {
    return <Loading />;
  }

  if (requests.length === 0) {
    return <p className="d-flex justify-content-center">No requests yet.</p>;
  }

  return (
    <div>
      <h3 className="mb-2">Friend requests</h3>
      <UserList
        users={requests}
        isFriendRequestList={true}
        onAcceptFriendRequest={onAcceptRequestClick}
        onDeclineFriendRequest={onDeclineRequestClick}
      />
    </div>
  );
};
