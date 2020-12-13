import React from "react";
import { useField } from "formik";
import { Toggle } from "rsuite";

export const MyToggle = ({ label, ...props }: any) => {
  const [field] = useField(props);

  return <Toggle {...field} {...props} />;
};
