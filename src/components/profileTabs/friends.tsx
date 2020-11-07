import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle } from "shards-react";
import { getFriendRequests, getFriends } from "../../api/user.api";
import { FriendRequest } from "../../types/FriendRequest";
import { Loading } from "../Loading";
import { UserExcerpt } from "../../types/UserExcerpt";

export const Friends: React.FC<{}> = () => {
  const [friends, setFriends] = useState<UserExcerpt[]>([]);
  const [loadingFriends, setLoadingFriends] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFriends() {
      try {
        const fFriends = await getFriends();
        setFriends(fFriends);
      } catch (e) {
        console.log(e);
      }

      setLoadingFriends(false);
    }

    fetchFriends();
  }, []);

  if (loadingFriends) {
    return <Loading />;
  }

  let friendList = null;

  if (friends.length === 0) {
    friendList = <div>No friends yet.</div>;
  } else {
    friendList = (
      <div>
        {friends.map((f) => (
          <Card className="mb-3">
            <CardBody>
              <CardTitle>{f.name}</CardTitle>
              <Link to={`/profile/${f.id}`}>
                <small className="text-secondary c-pointer block mt-3 mb-3">
                  See profile
                </small>
              </Link>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }

  return <div>{friendList}</div>;
};
