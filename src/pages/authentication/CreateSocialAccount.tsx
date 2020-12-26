import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from "rsuite";
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
                  <Button
                    appearance="primary"
                    disabled={isSubmitting}
                    type="submit"
                  >
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
    <CenteredFormWrapper>
      <CenteredFormContainer>
        {!isDataPresent && alert}
        {form}
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default CreateSocialAccount;
