import { InputLabel, TextField } from "@mui/material";
import React, { Fragment } from "react";

const ReutilizableInput = ({ ...props }) => {
  return (
    <Fragment>
      <InputLabel
        sx={{ fontWeight: 500, marginTop: 2, color: "#F5F5F5", fontSize: 17.5 }}
        htmlFor={props.id}
      >
        {props.label}
      </InputLabel>
      <TextField
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        error={props.shouldDisplayError}
        helperText={props.shouldDisplayError ? props.errorText : ""}
        type={props.type}
        name={props.id}
        id={props.id}
        placeholder={props.placeholder}
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: "#F5F5F5",
          borderRadius: "5px 5px 5px 5px",
          fontSize: 17.5,
        }}
      />
    </Fragment>
  );
};

export default ReutilizableInput;
