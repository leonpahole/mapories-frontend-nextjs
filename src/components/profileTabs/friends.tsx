import React, { useEffect, useState } from "react";
import { getFriends } from "../../api/user.api";
import { UserExcerpt } from "../../types/UserExcerpt";
import { Loading } from "../Loading";
import { UserList } from "../users/UserList";

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

  if (friends.length === 0) {
    return <p className="d-flex justify-content-center">No friends yet.</p>;
  }

  return (
    <div>
      <h3 className="mb-2">Friends</h3>
      <UserList users={friends} />
    </div>
  );
};
