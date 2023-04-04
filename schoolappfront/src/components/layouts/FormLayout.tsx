import { FC, Fragment, ReactNode } from "react";

import { Grid } from "@mui/material";

const FormLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Grid
      sx={{ p: 2 }}
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      {children}
    </Grid>
  );
};

export default FormLayout;
