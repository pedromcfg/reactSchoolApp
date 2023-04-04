import {
  Box,
  Grid,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import React, { FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "../FormLayout";
import ReutilizableButton from "../../UI/ReutilizableButton";
import ReutilizableInput from "../../UI/ReutilizableInput";
import useInput, {
  validateEmail,
  validatePassword,
} from "../../hooks/inputAction";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { login, reset } from "../../../store/slices/authSlice";
import { LoginUser } from "../../../store/interfaces/interfaces";

const LoginForm = () => {
  
  const {
    text: email,
    shouldDisplayError: emailHasError,
    errorText: emailErrorText,
    ChangeHandler: emailChangeHandler,
    BlurHandler: emailBlurHandler,
    ClearHandler: emailClearHandler,
  } = useInput(validateEmail);

  const {
    text: password,
    shouldDisplayError: passwordHasError,
    errorText: passwordErrorText,
    ChangeHandler: passwordChangeHandler,
    BlurHandler: passwordBlurHandler,
    ClearHandler: passwordClearHandler,
  } = useInput(validatePassword);

  const clearForm = () => {
    emailClearHandler();
    passwordClearHandler();
  };

  const dispatch = useAppDispatch();
  const { isLoading, isSuccessful, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccessful) {
      dispatch(reset());
      clearForm();
    }
  }, [isSuccessful, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate("/");
  }, [isAuthenticated]);

  const LoginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailHasError || passwordHasError) return;
    if (email.length === 0 || password.length === 0) return;

    const loginUser: LoginUser = { email, password };
    const result = await dispatch(login(loginUser));
    if (result.payload === "User not found!")
      alert(result.payload);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <FormLayout>
      <Box sx={{ width: "50%" }}>
        <form onSubmit={LoginHandler}>
          <Grid container direction="column" justifyContent="flex-end">
            <Typography variant="h4" align="center">
              Login
            </Typography>

            <ReutilizableInput
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              shouldDisplayError={emailHasError}
              errorText={emailErrorText}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
              onClear={emailClearHandler}
            />

            <ReutilizableInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              shouldDisplayError={passwordHasError}
              errorText={passwordErrorText}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
              onClear={passwordClearHandler}
            />

            <Typography align="center">
              <ReutilizableButton
                type="submit"
                color="warning"
                disabled={
                  !emailHasError && !passwordHasError && email && password
                }
              >
                Sign In
              </ReutilizableButton>
            </Typography>
          </Grid>
        </form>

        <Divider
          sx={{ borderColor: "#4caf50", width: "100%", borderBottomWidth: 1 }}
        />

        <Typography sx={{ marginTop: 2, textAlign: "center" }}>
          <small>
            Are you a teacher looking to apply to our institution?Then{" "}
            <Link to="/register" style={{ color: "#4caf50" }}>
              sign up
            </Link>
            !
          </small>
        </Typography>
      </Box>
    </FormLayout>
  );
};

export default LoginForm;
