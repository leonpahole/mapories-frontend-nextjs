import { Formik } from "formik";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState } from "react";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Link } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { createPost } from "../api/post.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormContainer } from "./login";

interface CreatePostInputType {
  content: string | null;
}

type CreatePostAlertType = "UNKNOWN_ERROR" | "CREATE_POST_SUCCESS";

const CreatePostAlertTypeInfo: Record<CreatePostAlertType, AlertTheme> = {
  UNKNOWN_ERROR: "danger",
  CREATE_POST_SUCCESS: "success",
};

const CreatePost: React.FC = () => {
  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    CreatePostAlertType
  >(CreatePostAlertTypeInfo);

  const [createdPostId, setCreatedPostId] = useState<null | string>(null);

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
      <h1>Create a post</h1>
      <p>Create your post.</p>

      <Formik<CreatePostInputType>
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          content: null,
        }}
        validationSchema={Yup.object({
          content: Yup.string().required("Please enter content!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const post = await createPost(values.content!);
            setCreatedPostId(post.id);
            showAlert("CREATE_POST_SUCCESS");
            resetForm();
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
                Create post!
              </Button>
            </div>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default CreatePost;
