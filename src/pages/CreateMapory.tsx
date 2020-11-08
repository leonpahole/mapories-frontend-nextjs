import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { Formik } from "formik";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { createMapory } from "../api/post.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormContainer } from "./login";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import MapGL, { PointerEvent, Marker, FlyToInterpolator } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

dayjs.extend(customParseFormat);

interface CreateMaporyInputType {
  content: string | null;
  rating: number | null;
  placeName: string | null;
  visitDate: string;
}

type CreateMaporyAlertType = "UNKNOWN_ERROR" | "CREATE_MAPORY_SUCCESS";

const CreateMaporyAlertTypeInfo: Record<CreateMaporyAlertType, AlertTheme> = {
  UNKNOWN_ERROR: "danger",
  CREATE_MAPORY_SUCCESS: "success",
};

function parseDateString(_: string, originalValue: string) {
  return dayjs(originalValue, "DD. MM. YYYY").toDate();
}

const originalViewPort = {
  latitude: 45.66,
  longitude: -33.9,
  zoom: 1,
  transitionDuration: 1000,
  transitionInterpolator: new FlyToInterpolator(),
};

const CreateMapory: React.FC = () => {
  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    CreateMaporyAlertType
  >(CreateMaporyAlertTypeInfo);

  const [createdMaporyId, setCreatedMaporyId] = useState<null | string>(null);

  const [viewport, setViewport] = useState(originalViewPort);

  const changeViewPort = (latitude: number, longitude: number) => {
    setViewport({ ...viewport, zoom: 16, latitude, longitude });
  };

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  const placeNameInputRef = useRef<HTMLInputElement>();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [placeName, setPlaceName] = useState<string>("");

  const geocoderContainerRef = useRef<HTMLDivElement>();

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides,
      });
    },
    [handleViewportChange]
  );

  const handleResult = useCallback(
    ({ result }: any) => {
      if (result.center && result.center.length >= 2) {
        setLongitude(Number(result.center[0]));
        setLatitude(Number(result.center[1]));
        if (placeName == null || placeName.length === 0) {
          setPlaceName(result.text);
        }
      }
    },
    [setLatitude, setLongitude, setPlaceName]
  );

  const onGeomapClear = useCallback(() => {
    setLatitude(null);
    setLongitude(null);
  }, [setLatitude, setLongitude]);

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "CREATE_MAPORY_SUCCESS" && createdMaporyId != null) {
      alertContent = (
        <>
          <p>Mapory created!</p>
          <Link to={`/post/${createdMaporyId}`} target="_blank">
            View mapory
          </Link>
        </>
      );
    } else if (alertType === "UNKNOWN_ERROR") {
      alertContent = (
        <>
          <p>Unknown error has occured.</p>
          <p>Please try again later.</p>
        </>
      );
    }
  }

  const onMapDoubleClick = (e: PointerEvent) => {
    setLongitude(e.lngLat[0]);
    setLatitude(e.lngLat[1]);
    changeViewPort(e.lngLat[1], e.lngLat[0]);
  };

  const locationNotSet = latitude == null || longitude == null;
  const [locationUnsetError, setLocationUnsetError] = useState<boolean>(false);

  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationEnabled(true);
    }
  }, []);

  const useCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);

      changeViewPort(position.coords.latitude, position.coords.longitude);
    });
  };

  return (
    <AuthFormContainer>
      <h1>Create a mapory</h1>
      <p>Create your map memory.</p>
      {locationNotSet ? "true" : "false"}

      <Formik<CreateMaporyInputType>
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: null,
          rating: null,
          placeName: null,
          visitDate: dayjs().format("DD. MM. YYYY"),
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter post content!"),
          rating: Yup.number()
            .nullable()
            .integer()
            .min(1, "Rating should be between 1 and 5")
            .max(5, "Password shouldn't be longer than 250 letters!"),
          visitDate: Yup.date()
            .typeError("Invalid date")
            .transform(parseDateString)
            .required("Please enter visit date!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          let valid = true;

          if (locationNotSet) {
            setLocationUnsetError(true);
            valid = false;
          }

          if (!valid) {
            return;
          }

          setLocationUnsetError(false);

          try {
            const visitDate = dayjs(values.visitDate, "DD. MM. YYYY").toDate();
            const { post: mapory } = await createMapory(
              values.content!,
              latitude!,
              longitude!,
              placeName,
              visitDate,
              values.rating
            );
            setCreatedMaporyId(mapory.id);
            showAlert("CREATE_MAPORY_SUCCESS");
            resetForm();
            setViewport(originalViewPort);
            setLatitude(null);
            setLongitude(null);
            setPlaceName("");
          } catch (e) {
            console.log(e);
            showAlert("UNKNOWN_ERROR");
          }
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <AuthForm onSubmit={handleSubmit}>
            <MyAlert
              dismissible={closeAlert}
              open={alertOpen}
              theme={alertTheme}
              className="mb-4"
            >
              {alertContent}
            </MyAlert>

            <MyTextInput
              value={values.content || ""}
              name="content"
              label="Content"
              placeholder="Enter post content"
              className="mb-0"
            />

            <MyTextInput
              value={values.rating || ""}
              name="rating"
              type="number"
              label="Rating (1-5)"
              placeholder="Enter rating"
            />

            <h5>Where were you?</h5>
            <p>Search on a map or place a marker by double clicking.</p>
            {locationEnabled && (
              <Button onClick={useCurrentPosition}>
                Use my current position
              </Button>
            )}
            {locationUnsetError && (
              <p style={{ color: "red" }}>
                Please select a place that you visited.
              </p>
            )}

            <div className="mb-4">
              <div ref={geocoderContainerRef as any} />
              <MapGL
                mapStyle="mapbox://styles/leonpahole/ckg8dkn8k6fmt1as4ausxm0pr"
                ref={mapRef as any}
                {...viewport}
                width="100%"
                height="400px"
                onViewportChange={handleViewportChange}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                onDblClick={onMapDoubleClick}
              >
                <Geocoder
                  mapRef={mapRef}
                  containerRef={geocoderContainerRef}
                  onViewportChange={handleGeocoderViewportChange}
                  mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                  position="top-left"
                  onResult={handleResult}
                  onClear={onGeomapClear}
                  marker={false}
                />
                {!locationNotSet && (
                  <Marker latitude={latitude!} longitude={longitude!}>
                    <>
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
                    </>
                  </Marker>
                )}
              </MapGL>
            </div>

            <MyTextInput
              ref={placeNameInputRef}
              onChange={(e: any) => setPlaceName(e.target.value)}
              value={placeName}
              validate={(_blank: string) => {
                let error;
                if (placeName == null || placeName.trim().length === 0) {
                  error = "Please enter place name!";
                }

                return error;
              }}
              name="placeName"
              label="Place name"
              placeholder="Name of the place"
            />

            <MyTextInput
              name="visitDate"
              label="Visit date"
              placeholder="Enter visit date"
            />

            <div className="d-flex mt-3">
              <Button disabled={isSubmitting} type="submit">
                Create mapory!
              </Button>
            </div>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default CreateMapory;
