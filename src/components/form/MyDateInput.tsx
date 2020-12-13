import React from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, ControlLabel, HelpBlock, DatePicker } from "rsuite";

export const MyDateInput = ({ label, help, ...props }: any) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();

  return (
    <FormGroup>
      <ControlLabel htmlFor={`#` + props.name}>{label}</ControlLabel>
      <DatePicker
        id={`#` + props.name}
        {...field}
        {...props}
        onChange={(d) => {
          setFieldValue(field.name, d);
        }}
        errorMessage={meta.error}
        errorPlacement={"bottomStart"}
      />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
};
