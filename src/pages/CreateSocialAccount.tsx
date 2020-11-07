import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import ImageUploader from "react-images-upload";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button } from "shards-react";
import styled from "styled-components";
import * as Yup from "yup";
import { registerSocial } from "../api/auth.api";
import { uploadProfilePicture } from "../api/user.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { loginAction } from "../redux/auth/auth.actions";
import { RootStore } from "../redux/store";
import { AlertTheme } from "../types/app";
import { UserExcerpt } from "../types/UserExcerpt";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";

type CreateSocialAccountAlertType = "MISSING_DATA" | "UNKNOWN_ERROR";

const CreateSocialAccountAlertTypeInfo: Record<
  CreateSocialAccountAlertType,
  AlertTheme
> = {
  MISSING_DATA: "danger",
  UNKNOWN_ERROR: "danger",
};

const ProfileImageContainer = styled.div`
  position: relative;
`;

const ProfileImage = styled.img`
  object-fit: cover;
  width: 100px;
  height: 100px;
  border: 1px solid rgba(0, 0, 0, 0.3);
`;

const DeleteImage = styled.div`
  position: absolute;
  top: -9px;
  right: -9px;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CreateSocialAccount: React.FC = () => {
  const history = useHistory();

  const dispatch = useDispatch();
  const createSocialAccountData = useSelector(
    (state: RootStore) => state.createSocialAccount.data
  );

  const [uploadedProfilePicture, setUploadedProfilePicture] = useState<
    string | undefined
  >(createSocialAccountData?.providerData.profilePictureUrl);
  const [uploadedProfilePictureFile, setUploadedProfilePictureFile] = useState<
    File | undefined
  >(undefined);

  const [userName, setUserName] = useState<string | undefined>(
    createSocialAccountData?.providerData.name
  );

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    CreateSocialAccountAlertType
  >(CreateSocialAccountAlertTypeInfo);

  useEffect(() => {
    if (createSocialAccountData == null) {
      showAlert("MISSING_DATA");
    }
  }, []);

  const onLogin = (user: UserExcerpt) => {
    dispatch(loginAction(user));
    history.push("/");
  };

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "MISSING_DATA" || alertType === "UNKNOWN_ERROR") {
      alertContent = (
        <>
          <p>Something went wrong.</p>
          <p className="mb-2">Please try logging in again.</p>{" "}
          <Link to={`/login`}>Go to login</Link>
        </>
      );
    }
  }

  const alert = (
    <MyAlert
      dismissible={closeAlert}
      open={alertOpen}
      className="mb-4"
      theme={alertTheme}
    >
      {alertContent}
    </MyAlert>
  );

  let form = null;
  const isDataPresent = createSocialAccountData != null;

  const onDrop = (files: File[], pictures: string[]) => {
    if (pictures.length > 0 && files.length > 0) {
      setUploadedProfilePicture(pictures[0]);
      setUploadedProfilePictureFile(files[0]);
    }
  };

  const onDeleteProfilePicture = () => {
    setUploadedProfilePicture(undefined);
    setUploadedProfilePictureFile(undefined);
  };

  if (isDataPresent) {
    form = (
      <>
        <h1>Create an account</h1>
        <p>
          You are about to create an account on Mapories. You can change your
          information below and click 'Create an account' when you are ready.
        </p>

        <ProfileImageContainer>
          {uploadedProfilePicture && (
            <DeleteImage onClick={onDeleteProfilePicture} className="bg-danger">
              X
            </DeleteImage>
          )}
          {uploadedProfilePicture ? (
            <ProfileImage src={uploadedProfilePicture} />
          ) : (
            <Avatar
              maxInitials={3}
              name={
                userName ? userName : createSocialAccountData!.providerData.name
              }
            />
          )}
        </ProfileImageContainer>
        <ImageUploader
          className="file-uploader"
          buttonClassName="btn btn-secondary"
          buttonText="Upload different profile image"
          onChange={onDrop}
          imgExtension={[".jpg", ".png"]}
          maxFileSize={2097152}
          label={"Max file size: 2mb, accepted: jpg|png"}
          singleImage={true}
          withIcon={false}
        />

        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            email: createSocialAccountData!.providerData.email,
            name: createSocialAccountData!.providerData.name,
          }}
          validationSchema={Yup.object({
            name: Yup.string()
              .max(40, "Name shouldn't be longer than 40 letters!")
              .required("Please enter your name!"),
          })}
          onSubmit={async (values, { resetForm }) => {
            try {
              const socialProfilePictureInUse =
                uploadedProfilePicture ===
                createSocialAccountData!.providerData.profilePictureUrl;

              let socialProfilePicture: string | undefined = undefined;
              if (socialProfilePictureInUse) {
                socialProfilePicture = createSocialAccountData!.providerData
                  .profilePictureUrl;
              }

              const user = await registerSocial(
                values.name,
                createSocialAccountData!.provider,
                createSocialAccountData!.accessToken,
                socialProfilePicture,
                createSocialAccountData!.accessTokenSecret
              );

              if (uploadedProfilePictureFile) {
                try {
                  await uploadProfilePicture(uploadedProfilePictureFile);
                } catch (e) {
                  console.log("Upload error");
                  console.log(e);
                }
              }

              onLogin(user);
              resetForm();
            } catch (e) {
              if (e?.response?.status === 409) {
                showAlert("UNKNOWN_ERROR");
              } else {
                showAlert("UNKNOWN_ERROR");
              }
            }
          }}
        >
          {({ handleSubmit, isSubmitting, handleChange }) => (
            <AuthForm onSubmit={handleSubmit}>
              {alert}

              <MyTextInput
                name="email"
                label="Your email (already determined)"
                disabled
              />

              <MyTextInput
                onChange={(e: any) => {
                  setUserName(e.target.value);
                  handleChange(e);
                }}
                name="name"
                label="Your name"
                placeholder="Enter your name"
              />

              <AuthFormBottomContainer className="mt-3">
                <Button disabled={isSubmitting} type="submit">
                  Create an account!
                </Button>
              </AuthFormBottomContainer>
            </AuthForm>
          )}
        </Formik>
      </>
    );
  }

  return (
    <AuthFormContainer>
      {!isDataPresent && alert}
      {form}
    </AuthFormContainer>
  );
};

export default CreateSocialAccount;
