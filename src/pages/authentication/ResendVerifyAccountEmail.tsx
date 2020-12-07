import { Formik } from "formik";
import React from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { resendVerifyAccountEmail } from "../../api/auth.api";
import { MyTextInput } from "../../components/form/MyTextInput";
import { MyAlert, MyAlertState } from "../../components/MyAlert";
import {
  UnknownErrorMyAlertState,
  UNKNOWN_ERROR,
  useAlert,
} from "../../hooks/useAlert";
import {
  CenteredForm,
  CenteredFormBottomContainer,
  CenteredFormContainer,
  CenteredFormWrapper,
} from "../../styledComponents/StyledForm";
import { Button } from "rsuite";

type ResendVerifyAccountEmailAlertAction =
  | { type: "SEND_SUCCESS" }
  | { type: typeof UNKNOWN_ERROR };

function resendVerifyAccountEmailAlertReducer(
  state: MyAlertState,
  action: ResendVerifyAccountEmailAlertAction
): MyAlertState {
  switch (action.type) {
    case "SEND_SUCCESS":
      return {
        type: "success",
        title: "Email was sent!",
        description: "Please check your mailbox for a verification email.",
      };
    case UNKNOWN_ERROR:
    default:
      return UnknownErrorMyAlertState;
  }
}

const ResendVerifyAccountEmail: React.FC = () => {
  let { email } = useParams();

  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<ResendVerifyAccountEmailAlertAction>(
    resendVerifyAccountEmailAlertReducer
  );

  return (
    <CenteredFormWrapper>
      <CenteredFormContainer>
        <h1 className="title text-center">Resend verify account email</h1>
        <p className="subtitle text-center">
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
              openAlert({ type: "SEND_SUCCESS" });
            } catch (e) {
              openAlert({ type: UNKNOWN_ERROR });
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
                  Resend verify account email
                </Button>
              </CenteredFormBottomContainer>
            </CenteredForm>
          )}
        </Formik>
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default ResendVerifyAccountEmail;
