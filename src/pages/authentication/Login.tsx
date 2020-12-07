import { Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { Button } from "rsuite";
import * as Yup from "yup";
import { login } from "../../api/auth.api";
import { MyCheckbox } from "../../components/form/MyCheckbox";
import { MyTextInput } from "../../components/form/MyTextInput";
import { MyAlert, MyAlertState } from "../../components/MyAlert";
import SocialLoginButtonRow from "../../components/social/SocialLoginButtonRow";
import {
  UnknownErrorMyAlertState,
  UNKNOWN_ERROR,
  useAlert,
} from "../../hooks/useAlert";
import { loginAction } from "../../redux/auth/auth.actions";
import {
  CenteredForm,
  CenteredFormBottomContainer,
  CenteredFormContainer,
  CenteredFormWrapper,
} from "../../styledComponents/StyledForm";
import { UserExcerpt } from "../../types/UserExcerpt";

type LoginAlertAction =
  | { type: "INVALID_CREDENTIALS" }
  | { type: "UNVERIFIED_EMAIL"; emailAddress: string }
  | { type: typeof UNKNOWN_ERROR };

function loginAlertReducer(
  state: MyAlertState,
  action: LoginAlertAction
): MyAlertState {
  switch (action.type) {
    case "INVALID_CREDENTIALS":
      return {
        type: "error",
        title: "Invalid email password combination.",
        description: "Please check your inputs.",
        link: {
          to: "/register",
          text: "If you haven't yet, create a free account.",
        },
      };
    case "UNVERIFIED_EMAIL":
      return {
        type: "error",
        title: "Please verify your email before signing in.",
        description: "Please check your inputs.",
        link: {
          to: `/resend-verify-account-email/${action.emailAddress}`,
          text: "Didn't receive the verification mail?",
          target: "_blank",
        },
      };
    case UNKNOWN_ERROR:
    default:
      return UnknownErrorMyAlertState;
  }
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<LoginAlertAction>(loginAlertReducer);

  const onLogin = (user: UserExcerpt) => {
    dispatch(loginAction(user));
    history.push("/");
  };

  return (
    <CenteredFormWrapper>
      <CenteredFormContainer>
        <h1 className="title text-center">Sign in</h1>
        <p className="subtitle text-center">
          Enter your Mapories account details to sign in.
        </p>

        <div className="mt-3">
          <SocialLoginButtonRow onLogin={onLogin} />
        </div>

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
            password: Yup.string().required("Please enter your password!"),
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

              if (!networkError) {
                if (e.response.status === 401) {
                  openAlert({ type: "INVALID_CREDENTIALS" });
                  return;
                } else if (e.response.status === 403) {
                  openAlert({
                    type: "UNVERIFIED_EMAIL",
                    emailAddress: values.email,
                  });
                  return;
                }
              }

              openAlert({
                type: UNKNOWN_ERROR,
              });
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
                className="mb-1"
              />

              <MyTextInput
                name="password"
                type="password"
                label="Your password"
                placeholder="Enter your password"
                className="mb-1"
              />

              <MyCheckbox name="rememberMe" label="Remember me?" />

              <small>
                <Link to="/forgot-password">Forgot password?</Link>
              </small>

              <small className="d-block mt-2">
                <Link to="/resend-verify-account-email">
                  Didn't receive verification mail?
                </Link>
              </small>

              <CenteredFormBottomContainer className="mt-3">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  appearance="primary"
                >
                  Sign me in!
                </Button>

                <Link to="/register">
                  <small className="d-block mt-3">Create an account</small>
                </Link>
              </CenteredFormBottomContainer>
            </CenteredForm>
          )}
        </Formik>
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default Login;
