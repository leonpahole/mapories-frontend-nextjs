import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Modal,
  Toggle,
} from "rsuite";
import { TypeAttributes } from "rsuite/lib/@types/common";
import { FileType } from "rsuite/lib/Uploader";
import * as Yup from "yup";
import {
  CreateOrUpdatePostData,
  createPost,
  updatePicturesForPost,
  updatePost,
} from "../../api/post.api";
import { useLoggedInUser } from "../../hooks/useLoggedInUser";
import {
  ModalForm,
  ModalFormContainer,
} from "../../styledComponents/StyledForm";
import { MapLocation } from "../../types/MaporyMapItem";
import { Post, PostExcerpt } from "../../types/Post";
import { ImageUploader } from "../form/ImageUploader";
import { MyDateInput } from "../form/MyDateInput";
import { MyRatingInput } from "../form/MyRatingInput";
import { MyTextInput } from "../form/MyTextInput";
import MapLocationPicker from "../map/MapLocationPicker";

dayjs.extend(customParseFormat);

interface CreateOrUpdateMaporyInputType {
  content: string;
  rating: number;
  visitDate: Date;
}

interface CreateNewPostOrMaporyModalProps {
  postToUpdate?: PostExcerpt;
  onCreate?(post: Post): void;
  onUpdate?(post: Post): void;
  size: TypeAttributes.Size;
  show: boolean;
  onHide: () => void;
}

export const CreateNewPostOrMaporyModal: React.FC<CreateNewPostOrMaporyModalProps> = ({
  postToUpdate,
  onCreate,
  onUpdate,
  size,
  show,
  onHide,
}) => {
  const [includeLocation, setIncludeLocation] = useState<boolean>(false);

  const [location, setLocation] = useState<MapLocation | null>(null);
  const [locationUnsetError, setLocationUnsetError] = useState<boolean>(false);

  const [placeName, setPlaceName] = useState<string>("");
  const [placeNameUnsetError, setPlaceNameUnsetError] = useState<boolean>(
    false
  );

  const loggedInUser = useLoggedInUser();

  const [pictureList, setPictureList] = useState<FileType[]>([]);

  useEffect(() => {
    if (show && postToUpdate) {
      setPostFormToPostToUpdate();
    } else if (!show && !postToUpdate) {
      resetPostForm();
    }
  }, [show]);

  const resetPostForm = () => {
    setIncludeLocation(false);
    setLocation(null);
    setLocationUnsetError(false);
    setPlaceName("");
    setPlaceNameUnsetError(false);
    setPictureList([]);
  };

  const setPostFormToPostToUpdate = () => {
    if (!postToUpdate) {
      return;
    }

    if (postToUpdate.mapory) {
      setIncludeLocation(true);
      setLocation(postToUpdate.mapory.location);
      setPlaceName(postToUpdate.mapory.placeName);
    } else {
      setIncludeLocation(false);
      setLocation(null);
      setPlaceName("");
    }

    setPictureList(
      postToUpdate.images.map((p, i) => ({
        name: p.url,
        url: p.url,
        fileKey: i,
      }))
    );
    setLocationUnsetError(false);
    setPlaceNameUnsetError(false);
  };

  const onMapLocationPickerChange = useCallback(
    (location: MapLocation | null) => {
      setLocation(location);
    },
    []
  );

  const onMapLocationPlaceNameChange = useCallback((name: string) => {
    setPlaceName(name);
  }, []);

  return (
    <Modal show={show} onHide={onHide} size={size}>
      <Modal.Header>
        <p className="subtitle">Create post</p>
      </Modal.Header>
      <Formik<CreateOrUpdateMaporyInputType>
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: postToUpdate ? postToUpdate.content : "",
          rating:
            postToUpdate && postToUpdate.mapory
              ? postToUpdate.mapory.rating || 0
              : 0,
          visitDate:
            postToUpdate && postToUpdate.mapory
              ? postToUpdate.mapory.visitDate
              : new Date(),
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter post content!"),
        })}
        onSubmit={async (values, { setErrors, resetForm }) => {
          let valid = true;

          if (includeLocation) {
            if (!location) {
              setLocationUnsetError(true);
              valid = false;
            }

            if (placeName == null || placeName.trim().length === 0) {
              setPlaceNameUnsetError(true);
              valid = false;
            }
          }

          if (!valid) {
            return;
          }

          setLocationUnsetError(false);

          try {
            const data: CreateOrUpdatePostData = {
              content: values.content,
              mapory: undefined,
            };

            if (includeLocation) {
              data.mapory = {
                latitude: location!.latitude,
                longitude: location!.longitude,
                placeName,
                rating: values.rating,
                visitDate: values.visitDate,
              };
            }

            let images: string[] = [];
            let post = null;

            if (postToUpdate) {
              post = await updatePost(postToUpdate.id, data);

              const newImages = pictureList.filter((p) => p.blobFile != null);
              const existingImages = pictureList.filter(
                (p) => p.blobFile == null
              );
              const deletedImages = postToUpdate.images.filter(
                (i) => !existingImages.some((ei) => ei.name === i.url)
              );

              images = await updatePicturesForPost(
                post.post.id,
                newImages,
                deletedImages.map((i) => i.url)
              );
            } else {
              post = await createPost(data);
              images = await updatePicturesForPost(post.post.id, pictureList);
            }

            const postWithImages: Post = {
              ...post,
              post: {
                ...post.post,
                images: images.map((url) => ({ url })),
              },
            };

            if (postToUpdate) {
              Alert.success("Post updated.", 5000);
              onUpdate && onUpdate(postWithImages);
            } else {
              Alert.success("Post created.", 5000);
              onCreate && onCreate(postWithImages);
            }

            resetForm();
            resetPostForm();
          } catch (e) {
            setErrors({ content: "Something went wrong!" });
            console.log(e);
          }
        }}
      >
        {({ handleSubmit, isSubmitting, values }) => (
          <ModalForm
            fluid
            onSubmit={handleSubmit}
            style={{ marginTop: "unset" }}
          >
            <Modal.Body style={{ paddingBottom: "unset" }}>
              <ModalFormContainer style={{ marginTop: "unset" }}>
                <MyTextInput
                  value={values.content}
                  componentClass="textarea"
                  placeholder="What is on your mind?"
                  rows={3}
                  name="content"
                  className="mb-0"
                />

                <Toggle
                  size="lg"
                  style={{
                    width: "160px",
                  }}
                  checked={includeLocation}
                  onChange={() => {
                    setIncludeLocation(!includeLocation);
                  }}
                  checkedChildren="Include location"
                  unCheckedChildren="Include location"
                />

                {includeLocation && (
                  <div className="d-flex mb-5 mt-3">
                    <div className="mr-2">
                      <div className="mb-3">
                        <h5>Where were you, {loggedInUser!.name}?</h5>
                        <p>
                          Search on a map or place a marker by double clicking.
                        </p>
                      </div>

                      <FormGroup>
                        <ControlLabel htmlFor={"#placeName"}>
                          Place name
                        </ControlLabel>
                        <FormControl
                          id={"#placeName"}
                          placeholder="Name of the place"
                          value={placeName}
                          onChange={(t) => {
                            setPlaceName(t);
                          }}
                          errorMessage={
                            placeNameUnsetError ? "Enter place name" : ""
                          }
                          errorPlacement={"bottomStart"}
                        />
                      </FormGroup>

                      <MyRatingInput
                        value={values.rating}
                        label={"Rate the place"}
                        name="rating"
                      />

                      <MyDateInput
                        label={"Date of visit"}
                        oneTap
                        block
                        name="visitDate"
                      />

                      {locationUnsetError && (
                        <p style={{ color: "red" }}>
                          Please select a place that you visited on the map.
                        </p>
                      )}
                    </div>
                    <div className="ml-3 flex-grow-1">
                      <MapLocationPicker
                        onChange={onMapLocationPickerChange}
                        onPlaceName={onMapLocationPlaceNameChange}
                        height={"100%"}
                        initialLocation={postToUpdate?.mapory?.location}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <ImageUploader
                    list={pictureList}
                    onChange={(l) => {
                      setPictureList(l);
                    }}
                  />
                </div>
              </ModalFormContainer>
            </Modal.Body>
            <Modal.Footer>
              <div className="d-flex mt-3">
                <Button
                  appearance="primary"
                  disabled={isSubmitting}
                  type="submit"
                  className="flex-grow-1"
                >
                  {postToUpdate ? "Update" : "Post"}!
                </Button>
                <div className="flex-grow-1">
                  <Button onClick={onHide} appearance="subtle">
                    Cancel
                  </Button>
                </div>
              </div>
            </Modal.Footer>
          </ModalForm>
        )}
      </Formik>
    </Modal>
  );
};
