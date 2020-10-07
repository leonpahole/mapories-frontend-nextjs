import React from "react";
import { useField } from "formik";
import { FormInput, FormGroup } from "shards-react";

export const MyTextInput = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  const isError = !!meta.error;

  return (
    <FormGroup>
      <label htmlFor={`#` + props.name}>{label}</label>
      <FormInput
        id={`#` + props.name}
        autoComplete={props.name || props.id}
        {...field}
        invalid={isError}
        {...props}
      />
      {isError && <small className="text-danger">{meta.error}</small>}
    </FormGroup>
  );
};
