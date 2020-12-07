import { Formik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import * as Yup from "yup";
import { register } from "../../api/auth.api";
import { MyTextInput } from "../../components/form/MyTextInput";
import { MyAlert, MyAlertState } from "../../components/MyAlert";
import SocialLoginButtonRow from "../../components/social/SocialLoginButtonRow";
import {
  UnknownErrorMyAlertState,
  UNKNOWN_ERROR,
  useAlert,
} from "../../hooks/useAlert";
import { loginAction } from "../../redux/auth/auth.actions";
import { UserExcerpt } from "../../types/UserExcerpt";
import {
  CenteredFormWrapper,
  CenteredFormContainer,
  CenteredForm,
  CenteredFormBottomContainer,
} from "../../styledComponents/StyledForm";
import { Button } from "rsuite";

type RegisterAlertAction =
  | { type: "REGISTER_SUCCESS"; emailAddress: string }
  | { type: typeof UNKNOWN_ERROR };

function registerAlertReducer(
  state: MyAlertState,
  action: RegisterAlertAction
): MyAlertState {
  switch (action.type) {
    case "REGISTER_SUCCESS":
      return {
        type: "success",
        title: "Congratulations, your account was created!",
        description: "Check your email for your account verification email.",
        link: {
          to: `/resend-verify-account-email/${action.emailAddress}`,
          text: "Didn't receive the verification mail?",
        },
      };
    case "UNKNOWN_ERROR":
    default:
      return UnknownErrorMyAlertState;
  }
}

const Register: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    alertOpen,
    alertState,
    openAlert,
    onAlertClose,
  } = useAlert<RegisterAlertAction>(registerAlertReducer);

  const onSocialLogin = (user: UserExcerpt) => {
    dispatch(loginAction(user));
    history.push("/");
  };

  return (
    <CenteredFormWrapper>
      <CenteredFormContainer>
        <h1 className="title text-center">Create an account</h1>
        <p className="subtitle text-center">
          Create your free Map'o'ries account.
        </p>

        <div className="mt-3">
          <SocialLoginButtonRow onLogin={onSocialLogin} />
        </div>

        <Formik
          validateOnBlur={false}
          validateOnChange={false}
          initialValues={{
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
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
              openAlert({
                type: "REGISTER_SUCCESS",
                emailAddress: values.email,
              });
            } catch (e) {
              if (e?.response?.status === 409) {
                setErrors({ email: "This email is taken!" });
              } else {
                openAlert({ type: UNKNOWN_ERROR });
              }
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

              <CenteredFormBottomContainer className="mt-3">
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  appearance="primary"
                >
                  Create an account!
                </Button>

                <Link to="/login">
                  <small className="c-pointer d-block mt-3">
                    Already have an account? Sign in
                  </small>
                </Link>
              </CenteredFormBottomContainer>
            </CenteredForm>
          )}
        </Formik>
      </CenteredFormContainer>
    </CenteredFormWrapper>
  );
};

export default Register;
