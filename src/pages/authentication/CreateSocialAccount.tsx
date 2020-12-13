import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import ImageUploader from "react-images-upload";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "shards-react";
import styled from "styled-components";
import * as Yup from "yup";
import { AuthenticationData, registerSocial } from "../../api/auth.api";
import { uploadProfilePicture } from "../../api/user.api";
import { MyTextInput } from "../../components/form/MyTextInput";
import { MyAlert, MyAlertState } from "../../components/MyAlert";
import {
  UnknownErrorMyAlertState,
  UNKNOWN_ERROR,
  useAlert,
} from "../../hooks/useAlert";
import { loginAction } from "../../redux/auth/auth.actions";
import { RootStore } from "../../redux/store";
import {
  CenteredForm,
  CenteredFormBottomContainer,
  CenteredFormContainer,
  CenteredFormWrapper,
} from "../../styledComponents/StyledForm";

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

type CreateSocialAccountAlertAction =
  | { type: "MISSING_DATA" }
  | { type: typeof UNKNOWN_ERROR };

function createSocialAccountAlertReducer(
  state: MyAlertState,
  action: CreateSocialAccountAlertAction
): MyAlertState {
  switch (action.type) {
    case "MISSING_DATA":
    case UNKNOWN_ERROR:
    default:
      return UnknownErrorMyAlertState;
  }
}

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

  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<CreateSocialAccountAlertAction>(createSocialAccountAlertReducer);

  useEffect(() => {
    if (createSocialAccountData == null) {
      openAlert({ type: "MISSING_DATA" });
    }
  }, []);

  const onLogin = (data: AuthenticationData) => {
    dispatch(loginAction(data));
    history.push("/");
  };

  const alert = (
    <MyAlert
      open={alertOpen}
      state={alertState}
      onClose={onAlertClose}
      className="mb-4"
    />
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
      <CenteredFormWrapper>
        <CenteredFormContainer>
          <h1 className="title text-center">Create an account</h1>
          <p className="subtitle text-center">
            You are about to create an account on Mapories. You can change your
            information below and click 'Create an account' when you are ready.
          </p>

          <ProfileImageContainer>
            {uploadedProfilePicture && (
              <DeleteImage
                onClick={onDeleteProfilePicture}
                className="bg-danger"
              >
                X
              </DeleteImage>
            )}
            {uploadedProfilePicture ? (
              <ProfileImage src={uploadedProfilePicture} />
            ) : (
              <Avatar
                maxInitials={3}
                name={
                  userName
                    ? userName
                    : createSocialAccountData!.providerData.name
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

                const data = await registerSocial(
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

                onLogin(data);
                resetForm();
              } catch (e) {
                openAlert({ type: UNKNOWN_ERROR });
              }
            }}
          >
            {({ handleSubmit, isSubmitting, handleChange }) => (
              <CenteredForm fluid onSubmit={handleSubmit}>
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

                <CenteredFormBottomContainer className="mt-3">
                  <Button disabled={isSubmitting} type="submit">
                    Create an account!
                  </Button>
                </CenteredFormBottomContainer>
              </CenteredForm>
            )}
          </Formik>
        </CenteredFormContainer>
      </CenteredFormWrapper>
    );
  }

  return (
    <CenteredFormContainer>
      {!isDataPresent && alert}
      {form}
    </CenteredFormContainer>
  );
};

export default CreateSocialAccount;
