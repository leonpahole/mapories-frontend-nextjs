import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import {
  CreateOrUpdatePostData,
  createPost,
  updatePost,
} from "../../api/post.api";
import {
  CenteredForm,
  CenteredFormContainer,
} from "../../styledComponents/StyledForm";
import { MapLocation } from "../../types/MaporyMapItem";
import { Post, PostExcerpt } from "../../types/Post";
import { MyTextInput } from "../form/MyTextInput";
import { MapLocationPicker } from "../map/MapLocationPicker";
import { Button } from "rsuite";
import { MyRatingInput } from "../form/MyRatingInput";

dayjs.extend(customParseFormat);

interface CreateOrUpdateMaporyInputType {
  content: string;
  rating: number;
  placeName: string;
  visitDate: string;
}

function parseDateString(_: string, originalValue: string) {
  return dayjs(originalValue, "DD. MM. YYYY").toDate();
}

interface CreateNewPostOrMaporyProps {
  postToUpdate?: PostExcerpt;
  onCreate(post: Post): void;
  onUpdate(post: Post): void;
}

export const CreateNewPostOrMapory: React.FC<CreateNewPostOrMaporyProps> = ({
  postToUpdate,
  onCreate,
  onUpdate,
}) => {
  const [locationUnsetError, setLocationUnsetError] = useState<boolean>(false);

  const placeNameInputRef = useRef<HTMLInputElement>();

  const [location, setLocation] = useState<MapLocation | null>(null);
  const [placeName, setPlaceName] = useState<string>("");

  return (
    <CenteredFormContainer style={{ marginTop: "unset" }}>
      <Formik<CreateOrUpdateMaporyInputType>
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: postToUpdate ? postToUpdate.content : "",
          rating:
            postToUpdate && postToUpdate.mapory
              ? postToUpdate.mapory.rating || 0
              : 0,
          placeName:
            postToUpdate && postToUpdate.mapory
              ? postToUpdate.mapory.placeName
              : "",
          visitDate:
            postToUpdate && postToUpdate.mapory
              ? dayjs(postToUpdate.mapory.visitDate).format("DD. MM. YYYY")
              : dayjs().format("DD. MM. YYYY"),
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
        onSubmit={async (values, { setErrors }) => {
          let valid = true;

          if (!location) {
            setLocationUnsetError(true);
            valid = false;
          }

          if (!valid) {
            return;
          }

          setLocationUnsetError(false);

          try {
            const visitDate = dayjs(values.visitDate, "DD. MM. YYYY").toDate();

            const data: CreateOrUpdatePostData = {
              content: values.content,
              mapory: {
                latitude: location!.latitude,
                longitude: location!.longitude,
                placeName,
                rating: values.rating,
                visitDate,
              },
            };

            if (postToUpdate) {
              const post = await updatePost(postToUpdate.id, data);
              onUpdate(post);
            } else {
              const post = await createPost(data);
              onCreate(post);
            }
          } catch (e) {
            setErrors({ content: "Something went wrong!" });
            console.log(e);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <CenteredForm
            fluid
            onSubmit={handleSubmit}
            style={{ marginTop: "unset" }}
          >
            <MyTextInput
              value={values.content}
              componentClass="textarea"
              placeholder="What is on your mind?"
              rows={3}
              name="content"
              className="mb-0"
            />

            <MyRatingInput value={values.rating} name="rating" />

            <h5>Where were you?</h5>
            <p>Search on a map or place a marker by double clicking.</p>

            <MapLocationPicker
              onChange={setLocation}
              onPlaceName={setPlaceName}
            />

            {locationUnsetError && (
              <p style={{ color: "red" }}>
                Please select a place that you visited.
              </p>
            )}

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
              <Button
                appearance="primary"
                disabled={isSubmitting}
                type="submit"
              >
                {postToUpdate ? "Update" : "Post"}!
              </Button>
            </div>
          </CenteredForm>
        )}
      </Formik>
    </CenteredFormContainer>
  );
};
