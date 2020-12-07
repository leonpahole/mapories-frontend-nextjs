import React from "react";
import { Message, MessageProps } from "rsuite";
import { Link } from "react-router-dom";

interface MyAlertProps {
  className?: string;
  open: boolean;
  onClose: () => void;
  state: MyAlertState;
}

export type MyAlertState = {
  title: string;
  type: MessageProps["type"];
  description?: string;
  link?: {
    to: string;
    text: string;
    target?: "_blank" | "_self";
  };
};

export const MyAlert: React.FC<MyAlertProps> = ({ state, open, ...props }) => {
  const { title, type, description, link } = state;
  let descriptionElement = (
    <div>
      {description && <p>{description}</p>}
      {link && (
        <Link to={link.to} target={link.target || "_self"}>
          {link.text}
        </Link>
      )}
    </div>
  );

  return (
    <>
      {open && (
        <Message
          showIcon
          type={type}
          title={title}
          description={descriptionElement}
          {...props}
        />
      )}
    </>
  );
};

// //{" "}
// <Alert {...props} dismissible={dismissible} open={open} theme={theme}>
//   //{" "}
//   <div className="d-flex align-items-center">
//     // <div className="mr-4">{icon}</div>
//     // <div>{children}</div>
//     //{" "}
//   </div>
//   //{" "}
// </Alert>
