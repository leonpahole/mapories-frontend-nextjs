import React, { useEffect, useState } from "react";
import { MaporyExcerpt } from "../../types/mapory";
import {
  getMaporiesForUser,
  likeMapory,
  unlikeMapory,
} from "../../api/mapory.api";
import { Loading } from "../Loading";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle, Button } from "shards-react";
import { MaporyCard } from "../mapory/maporyCard";

interface UserMaporiesListProps {
  userId: string;
}

export const UserMaporiesList: React.FC<UserMaporiesListProps> = ({
  userId,
}) => {
  const [mapories, setMapories] = useState<MaporyExcerpt[]>([]);
  const [loadingMapories, setLoadingMapories] = useState<boolean>(true);

  useEffect(() => {
    async function fetchMapories() {
      try {
        const fMapories = await getMaporiesForUser(userId);
        setMapories(fMapories);
      } catch (e) {
        console.log(e);
      }

      setLoadingMapories(false);
    }

    fetchMapories();
  }, [userId]);

  if (loadingMapories) {
    return <Loading />;
  }

  let maporiesList = null;

  const modifyMaporiesWhenLikeOrUnlike = async (
    mapory: MaporyExcerpt,
    isLike: boolean
  ) => {
    setMapories((mList) => {
      return mList.map((m) => {
        if (m.id !== mapory.id) {
          return m;
        }

        return {
          ...m,
          likesAmount: m.likesAmount + (isLike ? 1 : -1),
          myLike: isLike,
        };
      });
    });
  };

  if (mapories.length === 0) {
    maporiesList = <div>No mapories yet.</div>;
  } else {
    maporiesList = (
      <div>
        {mapories.map((m) => (
          <MaporyCard
            mapory={m}
            onLikeOrUnlike={(isLike: boolean) =>
              modifyMaporiesWhenLikeOrUnlike(m, isLike)
            }
            showSeeDetails={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Link to="/create-mapory">
        <small className="text-secondary c-pointer block mt-3 mb-3">
          Create a mapory
        </small>
      </Link>

      {maporiesList}
    </div>
  );
};
