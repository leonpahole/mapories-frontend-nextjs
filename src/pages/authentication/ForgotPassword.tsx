import { Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { sendForgotPasswordEmail } from "../../api/auth.api";
import { MyTextInput } from "../../components/form/MyTextInput";
import { MyAlert, MyAlertState } from "../../components/MyAlert";
import {
  useAlert,
  UNKNOWN_ERROR,
  UnknownErrorMyAlertState,
} from "../../hooks/useAlert";
import {
  CenteredForm,
  CenteredFormBottomContainer,
  CenteredFormContainer,
  CenteredFormWrapper,
} from "../../styledComponents/StyledForm";
import { Button } from "rsuite";

type ForgotPasswordAlertAction =
  | { type: "SEND_SUCCESS" }
  | { type: typeof UNKNOWN_ERROR };

function forgotPasswordAlertReducer(
  state: MyAlertState,
  action: ForgotPasswordAlertAction
): MyAlertState {
  switch (action.type) {
    case "SEND_SUCCESS":
      return {
        type: "success",
        title: "Email was sent!",
        description: "Please check your mailbox for a reset password email.",
      };
    case UNKNOWN_ERROR:
    default:
      return UnknownErrorMyAlertState;
  }
}

const ForgotPassword: React.FC = () => {
  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<ForgotPasswordAlertAction>(forgotPasswordAlertReducer);

  return (
    <CenteredFormWrapper>
      <CenteredFormContainer>
        <h1 className="title text-center">Reset password using email</h1>
        <p className="subtitle text-center">
          If you forgot your password, please input your email below to receive
          a forgot password email.
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
              openAlert({ type: "SEND_SUCCESS" });
            } catch (e) {
              openAlert({ type: "UNKNOWN_ERROR" });
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <CenteredForm fluid onSubmit={handleSubmit}>
              <MyAlert
                open={alertOpen}
                state={alertState}
                onClose={onAlertClose}
                className="mb-4"
              />

              <MyTextInput
                name="email"
                label="Your e-mail"
                placeholder="Enter your email"
              />

              <CenteredFormBottomContainer className="mt-3">
                <Button
                  appearance="primary"
                  disabled={isSubmitting}
                  type="submit"
                >
                  Resend reset password email
                </Button>
              </CenteredFormBottomContainer>
            </CenteredForm>
          )}
        </Formik>
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default ForgotPassword;
