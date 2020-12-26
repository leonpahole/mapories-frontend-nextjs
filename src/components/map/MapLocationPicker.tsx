import React, { useCallback, useEffect, useRef, useState } from "react";
import Geocoder from "react-map-gl-geocoder";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Icon, IconButton } from "rsuite";
import { MapLocation } from "../../types/MaporyMapItem";
import { defaultViewport, Map } from "./Map";

const VIEWPORT_DBLCLICK_ZOOM = 16;

interface MapLocationPickerProps {
  onChange(location: MapLocation | null): void;
  onPlaceName(name: string): void;
  height?: string;
  initialLocation?: MapLocation;
}

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onChange,
  onPlaceName,
  height,
  initialLocation,
}) => {
  const mapRef = useRef();
  const geocoderContainerRef = useRef<HTMLDivElement>();
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [viewport, setViewport] = useState(defaultViewport);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(
    null
  );

  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationEnabled(true);
    }
  }, []);

  const zoomIntoViewPort = useCallback((location: MapLocation) => {
    setViewport({
      ...viewport,
      zoom: VIEWPORT_DBLCLICK_ZOOM,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }, []);

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

  const onMapDoubleClick = useCallback((location: MapLocation) => {
    setAndSendLocation(location);
    zoomIntoViewPort(location);
  }, []);

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

  const setAndSendLocation = useCallback((location: MapLocation | null) => {
    setSelectedLocation(location);
    onChange(location);
  }, []);

  return (
    <>
      <div
        className="d-flex align-items-center"
        style={{ marginBottom: "8px" }}
      >
        <div ref={geocoderContainerRef as any} className="flex-grow-1 mr-1" />
        {locationEnabled && (
          <div className="flex-grow-1 ml-1">
            <IconButton
              onClick={useCurrentPosition}
              icon={<Icon icon="location-arrow" />}
              placement="left"
              appearance="primary"
              style={{ width: "100%" }}
            >
              Use my current location
            </IconButton>
          </div>
        )}
      </div>
      <Map
        height={height ? height : "400px"}
        mapRef={mapRef}
        onDblClick={onMapDoubleClick}
        viewport={viewport}
        markers={
          selectedLocation ? [{ location: selectedLocation, id: "1" }] : []
        }
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
          style={{ maxWidth: "unset", width: "100%" }}
        />
      </Map>
    </>
  );
};

export default React.memo(MapLocationPicker);
