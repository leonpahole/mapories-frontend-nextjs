import React from "react";
import { UserProfileData } from "../../types/UserProfile";
import { Formik } from "formik";
import { AuthForm, AuthFormBottomContainer } from "../../pages/login";
import { MyTextInput } from "../formik/MyTextInput";
import * as Yup from "yup";
import { Button } from "shards-react";
import { changePassword } from "../../api/auth.api";
import { useSelector } from "react-redux";
import { RootStore } from "../../redux/store";

interface UserProfileProps {
  userProfileData: UserProfileData;
  isMe: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  userProfileData: userProfile,
  isMe,
}) => {
  return (
    <div>
      <p>
        <b>Display name:</b> {userProfile.name}
      </p>

      {isMe && (
        <>
          <h4>Password</h4>
          <p>Change your password</p>

          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              password: "test",
              confirmPassword: "test",
            }}
            validationSchema={Yup.object({
              password: Yup.string()
                .min(4, "Password should be at least 4 letters long!")
                .max(250, "Password shouldn't be longer than 250 letters!")
                .required("Please enter your password!"),
              confirmPassword: Yup.string()
                .oneOf(
                  [Yup.ref("password"), undefined],
                  "Passwords don't match!"
                )
                .required("Please confirm your password!"),
            })}
            onSubmit={async (values, { resetForm, setErrors }) => {
              try {
                await changePassword(values.password);
                resetForm();
                alert("Success!");
              } catch (e) {
                console.log(e);
                alert("Error");
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <AuthForm onSubmit={handleSubmit}>
                <MyTextInput
                  name="password"
                  type="password"
                  label="New password"
                  placeholder="Enter new password"
                />

                <MyTextInput
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  placeholder="Confirm your password"
                />

                <AuthFormBottomContainer className="mt-3">
                  <Button disabled={isSubmitting} type="submit">
                    Change
                  </Button>
                </AuthFormBottomContainer>
              </AuthForm>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
