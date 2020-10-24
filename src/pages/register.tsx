import { Formik } from "formik";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { register } from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";
import SocialLoginButtonRow from "../components/social/SocialLoginButtonRow";
import { AuthUser } from "../types/AuthUser";
import { loginAction } from "../redux/auth/auth.actions";
import { useDispatch } from "react-redux";

type RegisterAlertType = "REGISTER_SUCCESS" | "UNKNOWN_ERROR";

const RegisterAlertTypeInfo: Record<RegisterAlertType, AlertTheme> = {
  REGISTER_SUCCESS: "success",
  UNKNOWN_ERROR: "danger",
};

const Register: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    RegisterAlertType
  >(RegisterAlertTypeInfo);

  const [createdUserEmailAddress, setCreatedUserEmailAddress] = useState<
    null | string
  >(null);

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "REGISTER_SUCCESS" && createdUserEmailAddress != null) {
      alertContent = (
        <>
          <p>Congratulations, your account was created!</p>
          <p className="mb-2">
            Please check your mailbox for a verification email.
          </p>
          <Link
            to={`/resend-verify-account-email/${createdUserEmailAddress}`}
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

  const onSocialLogin = (user: AuthUser) => {
    dispatch(loginAction(user));
    history.push("/");
  };

  return (
    <AuthFormContainer>
      <h1>Register</h1>
      <p>Create your free Map'o'ries account.</p>

      <SocialLoginButtonRow onLogin={onSocialLogin} />

      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          email: "leonnieen@gmail.com",
          name: "test",
          password: "test",
          confirmPassword: "test",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address!")
            .max(250, "Email shouldn't be longer than 250 letters!")
            .required("Please enter your email address!"),
          name: Yup.string()
            .max(40, "Name shouldn't be longer than 40 letters!")
            .required("Please enter your name!"),
          password: Yup.string()
            .min(4, "Password should be at least 4 letters long!")
            .max(250, "Password shouldn't be longer than 250 letters!")
            .required("Please enter your password!"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords don't match!")
            .required("Please confirm your password!"),
        })}
        onSubmit={async (values, { resetForm, setErrors }) => {
          try {
            await register(values.email, values.name, values.password);
            resetForm();
            setCreatedUserEmailAddress(values.email);
            showAlert("REGISTER_SUCCESS");
          } catch (e) {
            if (e?.response?.status === 409) {
              setErrors({ email: "This email is taken!" });
            } else {
              showAlert("UNKNOWN_ERROR");
            }
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <AuthForm onSubmit={handleSubmit}>
            <MyAlert
              dismissible={closeAlert}
              open={alertOpen}
              className="mb-4"
              theme={alertTheme}
            >
              {alertContent}
            </MyAlert>

            <MyTextInput
              name="email"
              label="Your e-mail"
              placeholder="Enter your email"
            />

            <MyTextInput
              name="name"
              label="Your name"
              placeholder="Enter your name"
            />

            <MyTextInput
              name="password"
              type="password"
              label="Your password"
              placeholder="Enter your password"
            />

            <MyTextInput
              name="confirmPassword"
              type="password"
              label="Confirm password"
              placeholder="Confirm your password"
            />

            <AuthFormBottomContainer className="mt-3">
              <Button disabled={isSubmitting} type="submit">
                Create an account!
              </Button>

              <Link to="/login">
                <small className="text-secondary c-pointer block mt-3">
                  Already have an account? Sign in
                </small>
              </Link>
            </AuthFormBottomContainer>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default Register;
