import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import {
  resetForgotPassword,
  validateForgotPasswordToken,
} from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { Loading } from "../components/Loading";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";

type ResetPasswordAlertType = "RESET_SUCCESS" | "UNKNOWN_ERROR";

const ResetPasswordAlertTypeInfo: Record<ResetPasswordAlertType, AlertTheme> = {
  RESET_SUCCESS: "success",
  UNKNOWN_ERROR: "danger",
};

const ResetPassword: React.FC = () => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    ResetPasswordAlertType
  >(ResetPasswordAlertTypeInfo);

  let { token } = useParams();

  useEffect(() => {
    async function tryVerifyToken() {
      try {
        const data = await validateForgotPasswordToken(token);
        setIsTokenValid(data.valid);
      } catch (e) {
        console.log("Verify error");
        console.log(e);
        setIsTokenValid(false);
      }

      setLoading(false);
    }

    tryVerifyToken();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!isTokenValid) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <MyAlert open={true} className="mt-3" theme={"danger"}>
          <p className="mb-2">The reset link has expired or is invalid.</p>
          <Link to="/forgot-password">Send another reset password email</Link>
        </MyAlert>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "RESET_SUCCESS") {
      alertContent = (
        <>
          <p className="mb-2">Password reset!</p>
          <Link to="/login">Click here to log in.</Link>
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
      <h1>Reset your password</h1>
      <p>
        Reset your password using the form below. If you don't want your
        password to change, you can safely close this page.
      </p>

      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object({
          password: Yup.string()
            .min(4, "Password should be at least 4 letters long!")
            .max(250, "Password shouldn't be longer than 250 letters!")
            .required("Please enter your new password!"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), undefined], "Passwords don't match!")
            .required("Please confirm your new password!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await resetForgotPassword(token, values.password);
            resetForm();
            showAlert("RESET_SUCCESS");
          } catch (e) {
            showAlert("UNKNOWN_ERROR");
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <AuthForm onSubmit={handleSubmit}>
            <MyAlert
              dismissible={
                alertType === "RESET_SUCCESS" ? undefined : closeAlert
              }
              open={alertOpen}
              theme={alertTheme}
              className="mb-4"
            >
              {alertContent}
            </MyAlert>

            {alertType !== "RESET_SUCCESS" && (
              <>
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
                    Reset password
                  </Button>
                </AuthFormBottomContainer>
              </>
            )}
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default ResetPassword;
