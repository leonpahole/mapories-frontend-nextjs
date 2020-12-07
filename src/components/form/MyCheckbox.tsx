import React from "react";
import { useField } from "formik";
import { FormCheckbox, FormGroup } from "shards-react";

export const MyCheckbox = ({ label, ...props }: any) => {
  const [field] = useField(props);

  return (
    <FormGroup>
      <FormCheckbox checked={field.value} {...field} {...props}>
        {label}
      </FormCheckbox>
    </FormGroup>
  );
};
