import { Formik } from "formik";
import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "shards-react";
import * as Yup from "yup";
import { resendVerifyAccountEmail } from "../api/auth.api";
import { MyTextInput } from "../components/formik/MyTextInput";
import { MyAlert } from "../components/MyAlert";
import { AlertTheme } from "../types/app";
import { useAlert } from "../utils/useAlert";
import { AuthForm, AuthFormBottomContainer, AuthFormContainer } from "./login";

type ResendAlertType = "SEND_SUCCESS" | "UNKNOWN_ERROR";

const ResendAlertTypeInfo: Record<ResendAlertType, AlertTheme> = {
  SEND_SUCCESS: "success",
  UNKNOWN_ERROR: "danger",
};

const ResendVerifyAccountEmail: React.FC = () => {
  let { email } = useParams();

  const { alertOpen, alertTheme, showAlert, closeAlert, alertType } = useAlert<
    ResendAlertType
  >(ResendAlertTypeInfo);

  let alertContent: any = null;

  if (alertType != null) {
    if (alertType === "SEND_SUCCESS") {
      alertContent = (
        <>
          <p>Email was sent!</p>
          <p>Please check your mailbox for a verification email.</p>
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
      <h1>Resend verify account email</h1>
      <p>
        If you haven't received verify account email, you can input your email
        address below and we will send it again.
      </p>

      <Formik
        validateOnBlur={false}
        validateOnChange={false}
        initialValues={{
          email: email || "",
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email("Invalid email address!")
            .required("Please enter your email address!"),
        })}
        onSubmit={async (values, { resetForm }) => {
          try {
            await resendVerifyAccountEmail(values.email);
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
                Resend verify account email
              </Button>
            </AuthFormBottomContainer>
          </AuthForm>
        )}
      </Formik>
    </AuthFormContainer>
  );
};

export default ResendVerifyAccountEmail;
