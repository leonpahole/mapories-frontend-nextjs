import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, Button } from "shards-react";
import {
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
} from "../../api/user.api";
import { FriendRequest } from "../../types/FriendRequest";
import { Loading } from "../Loading";
import { request } from "http";

export const FriendRequests: React.FC<{}> = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState<boolean>(true);

  useEffect(() => {
    async function fetchRequests() {
      try {
        const fRequests = await getFriendRequests();
        setRequests(fRequests);
      } catch (e) {
        console.log(e);
      }

      setLoadingRequests(false);
    }

    fetchRequests();
  }, []);

  if (loadingRequests) {
    return <Loading />;
  }

  const removeFriendRequest = (userId: string) => {
    setRequests((r) => r.filter((r1) => r1.from.id !== userId));
  };

  const onAcceptRequestClick = async (userId: string) => {
    try {
      await acceptFriendRequest(userId);
      removeFriendRequest(userId);
      alert("Acccept!");
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  const onDeclineRequestClick = async (userId: string) => {
    try {
      await declineFriendRequest(userId);
      removeFriendRequest(userId);
      alert("Declined!");
    } catch (e) {
      console.log(e);
      alert("Error!");
    }
  };

  let requestsList = null;

  if (requests.length === 0) {
    requestsList = <div>No friend requests yet.</div>;
  } else {
    requestsList = (
      <div>
        {requests.map((r) => (
          <Card className="mb-3">
            <CardBody>
              <CardTitle>{r.from.name}</CardTitle>
              <Link to={`/profile/${r.from.id}`}>
                <small className="text-secondary c-pointer block mt-3 mb-3">
                  See profile
                </small>
              </Link>
              <div className="d-flex">
                <Button onClick={() => onAcceptRequestClick(r.from.id)}>
                  Accept friend request
                </Button>
                <Button onClick={() => onDeclineRequestClick(r.from.id)}>
                  Decline friend request
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return <div>{requestsList}</div>;
};
