import { Formik } from "formik";
import React from "react";
import { Button } from "shards-react";
import * as Yup from "yup";
import { changePassword } from "../../api/auth.api";
import {
  CenteredForm,
  CenteredFormBottomContainer,
} from "../../styledComponents/StyledForm";
import { UserProfileData } from "../../types/UserProfile";
import { MyTextInput } from "../form/MyTextInput";

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
              <CenteredForm onSubmit={handleSubmit}>
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

                <CenteredFormBottomContainer className="mt-3">
                  <Button disabled={isSubmitting} type="submit">
                    Change
                  </Button>
                </CenteredFormBottomContainer>
              </CenteredForm>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};
