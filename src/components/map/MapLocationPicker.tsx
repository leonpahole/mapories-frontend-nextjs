import React, { useCallback, useEffect, useRef, useState } from "react";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Button } from "rsuite";
import { MapLocation } from "../../types/MaporyMapItem";
import { defaultViewport, Map } from "./Map";

const VIEWPORT_DBLCLICK_ZOOM = 16;

interface MapLocationPickerProps {
  onChange(location: MapLocation | null): void;
  onPlaceName(name: string): void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onChange,
  onPlaceName,
}) => {
  const mapRef = useRef();
  const geocoderContainerRef = useRef<HTMLDivElement>();
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [viewport, setViewport] = useState(defaultViewport);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationEnabled(true);
    }
  }, []);

  const zoomIntoViewPort = (location: MapLocation) => {
    setViewport({
      ...viewport,
      zoom: VIEWPORT_DBLCLICK_ZOOM,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const useCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setAndSendLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      zoomIntoViewPort({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const onMapDoubleClick = (location: MapLocation) => {
    setAndSendLocation(location);
    zoomIntoViewPort(location);
  };

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const onGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  const onGeocoderResult = useCallback(({ result }: any) => {
    if (result.center && result.center.length >= 2) {
      setAndSendLocation({
        latitude: Number(result.center[1]),
        longitude: Number(result.center[0]),
      });
      onPlaceName(result.text);
    }
  }, []);

  const onGeocoderClear = useCallback(() => {
    setAndSendLocation(null);
  }, []);

  const setAndSendLocation = (location: MapLocation | null) => {
    setSelectedLocation(location);
    onChange(location);
  };

  return (
    <>
      <div ref={geocoderContainerRef as any} />
      {locationEnabled && (
        <Button appearance="primary" onClick={useCurrentPosition}>
          Use my current position
        </Button>
      )}
      <Map
        height="400px"
        mapRef={mapRef}
        onDblClick={onMapDoubleClick}
        viewport={viewport}
        markers={selectedLocation ? [selectedLocation] : []}
      >
        <Geocoder
          mapRef={mapRef}
          containerRef={geocoderContainerRef}
          onViewportChange={onGeocoderViewportChange}
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          position="top-left"
          onResult={onGeocoderResult}
          onClear={onGeocoderClear}
          marker={false}
        />
      </Map>
    </>
  );
};
