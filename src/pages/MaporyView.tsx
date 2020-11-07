import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardBody, CardTitle, CardSubtitle } from "shards-react";
import { MaporyExcerpt, Mapory } from "../types/mapory";
import { getMaporyById } from "../api/mapory.api";
import { Loading } from "../components/Loading";
import MapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { MaporyCard } from "../components/mapory/maporyCard";

export const MaporyView: React.FC<{}> = ({}) => {
  const [mapory, setMapory] = useState<Mapory | null>(null);
  const [loadingMapory, setLoadingMapory] = useState<boolean>(true);

  let { id } = useParams();

  const [viewport, setViewport] = useState({
    latitude: 45.66,
    longitude: -33.9,
    zoom: 1,
    transitionDuration: 1000,
    transitionInterpolator: new FlyToInterpolator(),
  });

  const changeViewPort = (latitude: number, longitude: number) => {
    setViewport({ ...viewport, zoom: 6, latitude, longitude });
  };

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  useEffect(() => {
    async function fetchMapory() {
      try {
        const fMapory = await getMaporyById(id);
        setMapory(fMapory);
        changeViewPort(fMapory.mapory.latitude, fMapory.mapory.longitude);
      } catch (e) {
        console.log(e);
      }

      setLoadingMapory(false);
    }

    fetchMapory();
  }, [id]);

  if (loadingMapory) {
    return <Loading />;
  }

  if (mapory == null) {
    return <p>Not found</p>;
  }

  const modifyMaporyWhenLikeOrUnlike = (isLike: boolean) => {
    setMapory((m) => ({
      ...m!,
      mapory: {
        ...m!.mapory,
        likesAmount: m!.mapory.likesAmount + (isLike ? 1 : -1),
        myLike: isLike,
      },
    }));
  };

  return (
    <MaporyCard
      mapory={mapory.mapory}
      onLikeOrUnlike={modifyMaporyWhenLikeOrUnlike}
      author={mapory.author}
      showMap={true}
    />
  );
};
