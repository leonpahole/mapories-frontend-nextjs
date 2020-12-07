import React from "react";
import { useField } from "formik";
import { FormGroup, ControlLabel, FormControl, HelpBlock } from "rsuite";

export const MyTextInput = ({ label, help, ...props }: any) => {
  const [field, meta] = useField(props);

  return (
    <FormGroup>
      <ControlLabel htmlFor={`#` + props.name}>{label}</ControlLabel>
      <FormControl
        id={`#` + props.name}
        {...field}
        {...props}
        onChange={(_, e) => {
          field.onChange(e);
        }}
        errorMessage={meta.error}
        errorPlacement={"bottomStart"}
      />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
    // <FormGroup>
    //   <label htmlFor={`#` + props.name}>{label}</label>
    //   <FormInput
    //     id={`#` + props.name}
    //     autoComplete={props.name || props.id}
    //     {...field}
    //     invalid={isError}
    //     {...props}
    //   />
    //   {isError && <small className="text-danger">{meta.error}</small>}
    // </FormGroup>
  );
};
