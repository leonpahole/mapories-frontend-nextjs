import React, { useState, useEffect, useCallback } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { Loading } from "../Loading";
import { getMaporiesForUser } from "../../api/mapory.api";
import { MaporyExcerpt } from "../../types/mapory";
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";
import { Link } from "react-router-dom";

interface UserMapProps {
  userId: string;
}

export const UserMap: React.FC<UserMapProps> = ({ userId }) => {
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

  const [viewport, setViewport] = useState({
    latitude: 45.66,
    longitude: -33.9,
    zoom: 1,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const [selectedMapory, setSelectedMapory] = useState<MaporyExcerpt | null>(
    null
  );

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  if (loadingMapories) {
    return <Loading />;
  }

  let map = null;
  if (mapories.length === 0) {
    map = <p>No mapories yet.</p>;
  } else {
    map = (
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/leonpahole/ckg8dkn8k6fmt1as4ausxm0pr"
        width="100%"
        height="400px"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        {mapories.map((m) => (
          <Marker latitude={m.latitude} longitude={m.longitude}>
            <div onClick={() => setSelectedMapory(m)}>
              <svg
                display="block"
                viewBox="0 0 27 41"
                style={{
                  width: `${Math.max(3 * viewport.zoom, 20)}px`,
                  height: `${Math.max(3 * viewport.zoom, 20)}px`,
                }}
                className="marker"
              >
                <g fill-rule="nonzero">
                  <g transform="translate(3.0, 29.0)" fill="#000000">
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="10.5"
                      ry="5.25002273"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="10.5"
                      ry="5.25002273"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="9.5"
                      ry="4.77275007"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="8.5"
                      ry="4.29549936"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="7.5"
                      ry="3.81822308"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="6.5"
                      ry="3.34094679"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="5.5"
                      ry="2.86367051"
                    ></ellipse>
                    <ellipse
                      opacity="0.04"
                      cx="10.5"
                      cy="5.80029008"
                      rx="4.5"
                      ry="2.38636864"
                    ></ellipse>
                  </g>
                  <g fill="#4668F2">
                    <path d="M27,13.5 C27,19.074644 20.250001,27.000002 14.75,34.500002 C14.016665,35.500004 12.983335,35.500004 12.25,34.500002 C6.7499993,27.000002 0,19.222562 0,13.5 C0,6.0441559 6.0441559,0 13.5,0 C20.955844,0 27,6.0441559 27,13.5 Z"></path>
                  </g>
                  <g opacity="0.25" fill="#000000">
                    <path d="M13.5,0 C6.0441559,0 0,6.0441559 0,13.5 C0,19.222562 6.7499993,27 12.25,34.5 C13,35.522727 14.016664,35.500004 14.75,34.5 C20.250001,27 27,19.074644 27,13.5 C27,6.0441559 20.955844,0 13.5,0 Z M13.5,1 C20.415404,1 26,6.584596 26,13.5 C26,15.898657 24.495584,19.181431 22.220703,22.738281 C19.945823,26.295132 16.705119,30.142167 13.943359,33.908203 C13.743445,34.180814 13.612715,34.322738 13.5,34.441406 C13.387285,34.322738 13.256555,34.180814 13.056641,33.908203 C10.284481,30.127985 7.4148684,26.314159 5.015625,22.773438 C2.6163816,19.232715 1,15.953538 1,13.5 C1,6.584596 6.584596,1 13.5,1 Z"></path>
                  </g>
                  <g transform="translate(6.0, 7.0)" fill="#FFFFFF"></g>
                  <g transform="translate(8.0, 8.0)">
                    <circle
                      fill="#000000"
                      opacity="0.25"
                      cx="5.5"
                      cy="5.5"
                      r="5.4999962"
                    ></circle>
                    <circle
                      fill="#FFFFFF"
                      cx="5.5"
                      cy="5.5"
                      r="5.4999962"
                    ></circle>
                  </g>
                </g>
              </svg>
            </div>
          </Marker>
        ))}
      </ReactMapGL>
    );
  }

  return (
    <>
      {selectedMapory && (
        <Modal
          open={selectedMapory != null}
          toggle={() => setSelectedMapory(null)}
        >
          <ModalHeader>{selectedMapory.name}</ModalHeader>
          <ModalBody>
            <p>{selectedMapory.placeName}</p>
            <Link to={`/mapory/${selectedMapory.id}`}>
              <small className="text-secondary c-pointer block mt-3 mb-3">
                See details
              </small>
            </Link>
          </ModalBody>
        </Modal>
      )}
      {/* {map} */}
    </>
  );
};
