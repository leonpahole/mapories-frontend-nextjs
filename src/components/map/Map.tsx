import React, { useState, useCallback, useEffect } from "react";
import MapGL, { FlyToInterpolator, PointerEvent } from "react-map-gl";
import { MapMarker } from "./MapMarker";
import { MapLocation } from "../../types/MaporyMapItem";

const MAP_STYLE = "mapbox://styles/leonpahole/ckg8dkn8k6fmt1as4ausxm0pr";

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  transitionDuration: number;
  transitionInterpolator: FlyToInterpolator;
}

export const defaultViewport = {
  latitude: 45.66,
  longitude: -33.9,
  zoom: 1,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
};

interface MapProps {
  markers?: MapLocation[];
  className?: string;
  width?: string;
  height: string;
  mapRef?: any;
  onDblClick?: (location: MapLocation) => void;
  viewport?: Viewport;
}

export const Map: React.FC<MapProps> = ({
  markers = [],
  className,
  width,
  height,
  mapRef,
  onDblClick,
  viewport: explicitViewport = defaultViewport,
  children,
}) => {
  const [viewport, setViewport] = useState(explicitViewport);

  useEffect(() => {
    setViewport(explicitViewport);
  }, [explicitViewport]);

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const onDoubleClick = useCallback((e: PointerEvent) => {
    const location: MapLocation = {
      longitude: e.lngLat[0],
      latitude: e.lngLat[1],
    };

    onDblClick && onDblClick(location);
  }, []);

  return (
    <MapGL
      ref={mapRef}
      mapStyle={MAP_STYLE}
      {...viewport}
      width={width || "100%"}
      height={height}
      className={className}
      onViewportChange={handleViewportChange}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onDblClick={onDoubleClick}
    >
      {markers.map((m) => (
        <MapMarker location={m} zoom={viewport.zoom} />
      ))}
      {children}
    </MapGL>
  );
};
