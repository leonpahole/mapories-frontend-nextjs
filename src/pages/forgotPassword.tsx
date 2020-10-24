import { Formik } from "formik";
import React from "react";
import { Button } from "shards-react";
import * as Yup from "yup";
import { sendForgotPasswordEmail } from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";

type SendForgotPasswordEmailAlertType = "SEND_SUCCESS" | "UNKNOWN_ERROR";

const SendForgotPasswordEmailAlertTypeInfo: Record<
  SendForgotPasswordEmailAlertType,
  AlertTheme
> = {
  SEND_SUCCESS: "success",
  UNKNOWN_ERROR: "danger",
};

const ForgotPassword: React.FC = () => {
  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    SendForgotPasswordEmailAlertType
  >(SendForgotPasswordEmailAlertTypeInfo);

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "SEND_SUCCESS") {
      alertContent = (
        <>
          <p>Email was sent!</p>
          <p>Please check your mailbox for a reset password email.</p>
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
      <h1>Reset password using email</h1>
      <p>
        If you forgot your password, please input your email below to receive a
        forgot password email.
      </p>

      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          email: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address!")
            .required("Please enter your email address!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await sendForgotPasswordEmail(values.email);
            resetForm();
            showAlert("SEND_SUCCESS");
          } catch (e) {
            showAlert("UNKNOWN_ERROR");
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

            <AuthFormBottomContainer className="mt-3">
              <Button disabled={isSubmitting} type="submit">
                Resend reset password email
              </Button>
            </AuthFormBottomContainer>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default ForgotPassword;
