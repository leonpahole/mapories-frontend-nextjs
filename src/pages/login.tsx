import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button, Form } from "shards-react";
import styled from "styled-components";
import * as Yup from "yup";
import { login } from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { loginAction } from "../redux/auth/auth.actions";
import { AlertTheme } from "../types/app";
import { AuthUser } from "../types/AuthUser";
import { useAlert } from "../utils/useAlert";
import SocialLoginButtonRow from "../components/social/SocialLoginButtonRow";
import { MyCheckbox } from "../components/formik/MyCheckbox";

export const AuthFormContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;
  flex-direction: column;
`;

export const AuthForm = styled(Form)`
  margin-top: 20px;
  margin-bottom: 20px;
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const AuthFormBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

type LoginAlertType =
  | "UNVERIFIED_EMAIL"
  | "INVALID_CREDENTIALS"
  | "UNKNOWN_ERROR";

const LoginAlertTypeInfo: Record<LoginAlertType, AlertTheme> = {
  UNVERIFIED_EMAIL: "warning",
  INVALID_CREDENTIALS: "danger",
  UNKNOWN_ERROR: "danger",
};

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    LoginAlertType
  >(LoginAlertTypeInfo);

  const [unverifiedEmailAddress, setUnverifiedEmailAddress] = useState<
    string | null
  >(null);

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "INVALID_CREDENTIALS") {
      alertContent = (
        <>
          <p>Invalid email password combination.</p>
          <p className="mb-2">Please check your inputs.</p>
          <Link to={`/register`} target="_blank">
            If you haven't yet, create a free account.
          </Link>
        </>
      );
    } else if (
      alertType === "UNVERIFIED_EMAIL" &&
      unverifiedEmailAddress != null
    ) {
      alertContent = (
        <>
          <p className="mb-2">Please verify your email before signing in.</p>
          <Link
            to={`/resend-verify-account-email/${unverifiedEmailAddress}`}
            target="_blank"
          >
            Didn't receive the verification mail?
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

  const onLogin = (user: AuthUser) => {
    dispatch(loginAction(user));
    history.push("/");
    setUnverifiedEmailAddress(null);
  };

  return (
    <AuthFormContainer>
      <h1>Sign in</h1>
      <p>Enter your Map'o'ries account details to sign in.</p>

      <SocialLoginButtonRow onLogin={onLogin} />

      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          email: "",
          password: "",
          rememberMe: false,
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address!")
            .required("Please enter your email address!"),
          password: Yup.string()
            .min(4, "Password should be at least 4 letters long!")
            .max(250, "Password shouldn't be longer than 250 letters!")
            .required("Please enter your password!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            const user = await login(
              values.email,
              values.password,
              values.rememberMe
            );
            onLogin(user);
            resetForm();
          } catch (e) {
            const networkError = e == null || e.response == null;

            let currentAlertType: LoginAlertType = "UNKNOWN_ERROR";

            if (!networkError) {
              if (e.response.status === 401) {
                currentAlertType = "INVALID_CREDENTIALS";
              } else if (e.response.status === 403) {
                currentAlertType = "UNVERIFIED_EMAIL";
                setUnverifiedEmailAddress(values.email);
              }
            }

            showAlert(currentAlertType);
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
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
              name="email"
              label="Your e-mail"
              placeholder="Enter your email"
              className="mb-0"
            />

            <MyTextInput
              name="password"
              type="password"
              label="Your password"
              placeholder="Enter your password"
            />

            <MyCheckbox name="rememberMe" label="Remember me?" />

            <small>
              <Link to="/forgot-password">Forgot password?</Link>
            </small>

            <AuthFormBottomContainer className="mt-3">
              <Button disabled={isSubmitting} type="submit">
                Sign me in!
              </Button>

              <Link to="/register">
                <small className="text-secondary c-pointer block mt-3">
                  Create an account
                </small>
              </Link>
            </AuthFormBottomContainer>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default Login;
