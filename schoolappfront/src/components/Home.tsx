import { Grid, Typography, CircularProgress } from "@mui/material";
import { Fragment } from "react";
import { selectedUser } from "../store/slices/authSlice";
import { useAppSelector } from "./hooks/reduxHooks";
import FormLayout from "./layouts/FormLayout";

const Home = () => {
  const { user } = useAppSelector(selectedUser);
  let contentToBeRendered;

  if (user?.role === "admin")
    contentToBeRendered = (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "rgba(33, 37, 41, 0.5)",
          paddingBottom: "20px",
          paddingTop: "20px",
          borderRadius: "10px",
        }}
      >
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Welcome, {user?.role}
        </Typography>
      </Grid>
    );

  return <FormLayout>
    {contentToBeRendered}
  </FormLayout>;
};

export default Home;
