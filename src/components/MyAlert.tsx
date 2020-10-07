import React from "react";
import { Alert } from "shards-react";
import { AlertTheme } from "../types/app";
import { FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

interface MyAlertProps {
  dismissible?: () => void;
  open: boolean;
  theme: AlertTheme;
  className?: string;
}

export const MyAlert: React.FC<MyAlertProps> = ({
  dismissible,
  open,
  theme,
  children,
  ...props
}) => {
  let icon = null;

  switch (theme) {
    case "warning":
      icon = <FaExclamationCircle />;
      break;

    case "danger":
      icon = <FaTimes />;
      break;

    case "info":
    default:
      icon = <FaInfoCircle />;
      break;
  }

  return (
    <Alert {...props} dismissible={dismissible} open={open} theme={theme}>
      <div className="d-flex align-items-center">
        <div className="mr-4">{icon}</div>
        <div>{children}</div>
      </div>
    </Alert>
  );
};
