import React, { useEffect, useState } from "react";
import { MaporyExcerpt } from "../../types/mapory";
import { getMaporiesForUser } from "../../api/mapory.api";
import { Loading } from "../Loading";
import { Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "shards-react";

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

  if (mapories.length === 0) {
    maporiesList = <div>No mapories yet.</div>;
  } else {
    maporiesList = (
      <div>
        {mapories.map((m) => (
          <Card className="mb-3">
            <CardBody>
              <CardTitle>{m.name}</CardTitle>
              <CardSubtitle>
                {m.placeName} - {m.visitDate}
              </CardSubtitle>
              {m.description}
              <Link to={`/mapory/${m.id}`}>
                <small className="text-secondary c-pointer block mt-3 mb-3">
                  See details
                </small>
              </Link>
            </CardBody>
          </Card>
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
