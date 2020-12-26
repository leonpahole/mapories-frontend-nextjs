import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as Yup from "yup";
import {
  resetForgotPassword,
  validateForgotPasswordToken,
} from "../../api/auth.api";
import { MyTextInput } from "../../components/form/MyTextInput";
import { Loading } from "../../components/Loading";
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

type ResetPasswordAlertAction =
  | { type: "RESET_SUCCESS" }
  | { type: "LINK_EXPIRED_OR_INVALID" }
  | { type: typeof UNKNOWN_ERROR };

function resetPasswordAlertReducer(
  state: MyAlertState,
  action: ResetPasswordAlertAction
): MyAlertState {
  switch (action.type) {
    case "RESET_SUCCESS":
      return {
        type: "success",
        title: "Password reset!",
        link: {
          to: "/login",
          text: "Click here to log in.",
        },
      };
    case "LINK_EXPIRED_OR_INVALID":
      return {
        type: "error",
        title: "An error has occured!",
        description: "The reset link has expired or is invalid.",
        link: {
          to: "/forgot-password",
          text: "Send another reset password email",
        },
      };
    case UNKNOWN_ERROR:
    default:
      return UnknownErrorMyAlertState;
  }
}

const ResetPassword: React.FC = () => {
  const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<ResetPasswordAlertAction>(resetPasswordAlertReducer);

  let { token } = useParams<{ token: string }>();

  useEffect(() => {
    async function tryVerifyToken() {
      let tokenValid = false;
      try {
        const data = await validateForgotPasswordToken(token);
        tokenValid = data.valid;
      } catch (e) {
        console.log("Verify error");
        console.log(e);
      }

      setIsTokenValid(tokenValid);
      if (!tokenValid) {
        openAlert({ type: "LINK_EXPIRED_OR_INVALID" });
      }

      setLoading(false);
    }

    tryVerifyToken();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const alert = (
    <MyAlert
      open={alertOpen}
      state={alertState}
      onClose={onAlertClose}
      className="mb-4"
    />
  );

  if (!isTokenValid) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        {alert}
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <CenteredFormWrapper>
      <CenteredFormContainer>
        <h1 className="title text-center">Reset your password</h1>
        <p className="subtitle text-center">
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
              openAlert({ type: "RESET_SUCCESS" });
              setResetSuccess(true);
            } catch (e) {
              openAlert({ type: UNKNOWN_ERROR });
            }
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <CenteredForm fluid onSubmit={handleSubmit}>
              {alert}

              {!resetSuccess && (
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

                  <CenteredFormBottomContainer className="mt-3">
                    <Button
                      appearance="primary"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      Reset password
                    </Button>
                  </CenteredFormBottomContainer>
                </>
              )}
            </CenteredForm>
          )}
        </Formik>
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default ResetPassword;
