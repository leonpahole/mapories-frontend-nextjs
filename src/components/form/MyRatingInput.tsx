import { useField } from "formik";
import React from "react";
import { ControlLabel, FormGroup, HelpBlock, Rate } from "rsuite";

export const MyRatingInput = ({ label, help, ...props }: any) => {
  const [field, _, helpers] = useField(props);

  return (
    <FormGroup>
      <ControlLabel htmlFor={`#` + props.name}>{label}</ControlLabel>
      <Rate
        id={`#` + props.name}
        {...field}
        {...props}
        onChange={(value) => {
          helpers.setValue(value);
        }}
      />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
};
