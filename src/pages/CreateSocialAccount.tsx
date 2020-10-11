import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { register, registerSocial } from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { useAlreadyLoggedInGuard } from "../utils/useAlreadyLoggedInGuard";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";
import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../redux/store";
import { createSocialAccountAction } from "../redux/createSocialAccount/createSocialAccount.actions";
import { loginAction } from "../redux/auth/auth.actions";
import { User } from "../types/User";

type CreateSocialAccountAlertType = "MISSING_DATA" | "UNKNOWN_ERROR";

const CreateSocialAccountAlertTypeInfo: Record<
  CreateSocialAccountAlertType,
  AlertTheme
> = {
  MISSING_DATA: "danger",
  UNKNOWN_ERROR: "danger",
};

const CreateSocialAccount: React.FC = () => {
  useAlreadyLoggedInGuard();

  const history = useHistory();

  const dispatch = useDispatch();
  const createSocialAccountData = useSelector(
    (state: RootStore) => state.createSocialAccount.data
  );

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    CreateSocialAccountAlertType
  >(CreateSocialAccountAlertTypeInfo);

  useEffect(() => {
    if (createSocialAccountData == null) {
      showAlert("MISSING_DATA");
    }
  }, []);

  const onLogin = (user: User) => {
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

  if (isDataPresent) {
    form = (
      <>
        <h1>Create an account</h1>
        <p>
          You are about to create an account on Mapories. You can change your
          information below and click 'Create an account' when you are ready.
        </p>

        <img
          width="100"
          height="100"
          src={createSocialAccountData!.providerData.profilePicture}
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
          onSubmit={async (values, { resetForm, setErrors }) => {
            try {
              const user = await registerSocial(
                values.name,
                createSocialAccountData!.provider,
                createSocialAccountData!.accessToken,
                createSocialAccountData!.accessTokenSecret
              );
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
          {({ handleSubmit, isSubmitting }) => (
            <AuthForm onSubmit={handleSubmit}>
              {alert}

              <MyTextInput
                name="email"
                label="Your email (already determined)"
                disabled
              />

              <MyTextInput
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
