import { Formik } from "formik";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useEffect } from "react";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Link, useParams } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { createPost, getPostById, updatePost } from "../api/post.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormContainer } from "./login";
import { Post, PostExcerpt } from "../types/Post";
import { Loading } from "../components/Loading";

interface CreatePostInputType {
  content: string | null;
}

type CreateOrUpdatePostAlertType =
  | "UNKNOWN_ERROR"
  | "CREATE_POST_SUCCESS"
  | "UPDATE_POST_SUCCESS";

const CreateOrUpdatePostAlertTypeInfo: Record<
  CreateOrUpdatePostAlertType,
  AlertTheme
> = {
  UNKNOWN_ERROR: "danger",
  CREATE_POST_SUCCESS: "success",
  UPDATE_POST_SUCCESS: "success",
};

const CreateOrUpdatePost: React.FC = () => {
  let { id } = useParams();

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    CreateOrUpdatePostAlertType
  >(CreateOrUpdatePostAlertTypeInfo);

  const [createdPostId, setCreatedPostId] = useState<null | string>(null);
  const [postToUpdate, setPostToUpdate] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchPostToUpdate() {
      if (id) {
        const post = await getPostById(id);
        setPostToUpdate(post);
      }

      setLoading(false);
    }

    fetchPostToUpdate();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "CREATE_POST_SUCCESS" && createdPostId != null) {
      alertContent = (
        <>
          <p>Post created!</p>
          <Link to={`/post/${createdPostId}`} target="_blank">
            View post
          </Link>
        </>
      );
    } else if (alertType === "UPDATE_POST_SUCCESS" && postToUpdate != null) {
      alertContent = (
        <>
          <p>Post updated!</p>
          <Link to={`/post/${postToUpdate.post.id}`} target="_blank">
            View post
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

  return (
    <AuthFormContainer>
      <h1>{postToUpdate ? "Update" : "Create"} a post</h1>
      <p>{postToUpdate ? "Update" : "Create"} your post.</p>

      <Formik<CreatePostInputType>
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: postToUpdate ? postToUpdate.post.content : null,
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter content!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (postToUpdate) {
              await updatePost(postToUpdate.post.id, values.content!);
              showAlert("UPDATE_POST_SUCCESS");
            } else {
              const { post } = await createPost(values.content!);
              showAlert("CREATE_POST_SUCCESS");
              setCreatedPostId(post.id);
              resetForm();
            }
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

            <div className="d-flex mt-3">
              <Button disabled={isSubmitting} type="submit">
                {postToUpdate ? "Update post!" : "Create post!"}
              </Button>
            </div>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default CreateOrUpdatePost;
