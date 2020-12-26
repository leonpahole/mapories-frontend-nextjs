import { Formik } from "formik";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Alert, Button } from "rsuite";
import * as Yup from "yup";
import { changePassword, logout } from "../../api/auth.api";
import { deleteAccount } from "../../api/user.api";
import { clearChatData } from "../../redux/chat/chat.actions";
import { clearNotificationData } from "../../redux/notification/notification.actions";
import {
  CenteredForm,
  CenteredFormBottomContainer,
} from "../../styledComponents/StyledForm";
import { ConfirmDialog } from "../ConfirmDialog";
import { MyTextInput } from "../form/MyTextInput";

export const ManageAccount: React.FC = () => {
  const [
    showDeleteAccountConfirm,
    setShowDeleteAccountConfirm,
  ] = useState<boolean>(false);

  const dispatch = useDispatch();

  const changePasswordForm = (
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
          .required("Please enter your password!"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), undefined], "Passwords don't match!")
          .required("Please confirm your password!"),
      })}
      onSubmit={async (values, { resetForm, setErrors }) => {
        try {
          await changePassword(values.password);
          resetForm();
          Alert.success("Password updated!");
        } catch (e) {
          console.log(e);
          setErrors({ confirmPassword: "An error occured!" });
        }
      }}
    >
      {({ handleSubmit, isSubmitting }) => (
        <CenteredForm fluid onSubmit={handleSubmit}>
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
            <Button appearance="primary" disabled={isSubmitting} type="submit">
              Change password
            </Button>
          </CenteredFormBottomContainer>
        </CenteredForm>
      )}
    </Formik>
  );

  const onDeleteAccount = async () => {
    await deleteAccount();
    setShowDeleteAccountConfirm(false);
    dispatch(clearNotificationData());
    dispatch(clearChatData());
    await logout();
  };

  const confirmDeleteAccountDialog = (
    <ConfirmDialog
      show={showDeleteAccountConfirm}
      onClose={() => setShowDeleteAccountConfirm(false)}
      onConfirm={onDeleteAccount}
      header={"Delete account?"}
      text={"Really delete you account? All data will be deleted."}
      confirmButtonText={"Yes"}
      confirmButtonColor={"red"}
      cancelButtonText={"No"}
    />
  );

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <h4>Password</h4>
        <p>Change your password</p>

        {changePasswordForm}

        <div
          style={{ color: "red" }}
          className="mt-3 d-flex flex-column align-items-center"
        >
          <h4>Delete account</h4>
          <p>
            WARNING: deleting your account will delete all account data for
            ever.
          </p>
          <Button
            className="mt-3"
            color="red"
            onClick={() => setShowDeleteAccountConfirm(true)}
          >
            Delete my account
          </Button>
        </div>
      </div>
      {confirmDeleteAccountDialog}
    </>
  );
};
