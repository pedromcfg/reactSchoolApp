import { Box, CircularProgress, Divider, Grid, Typography } from "@mui/material";
import { FC, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReutilizableButton from "../../UI/ReutilizableButton";
import ReutilizableInput from "../../UI/ReutilizableInput";
import FormLayout from "../FormLayout";

import useInput from "../../hooks/inputAction";
import {
  validateLength,
  validateEmail,
  validatePassword,
} from "../../hooks/inputAction";
import { NewUser } from "../../../store/interfaces/interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { register, reset } from "../../../store/slices/authSlice";

const RegisterForm: FC = () => {
  const {
    text: firstName,
    shouldDisplayError: firstNameHasError,
    errorText: firstNameErrorText,
    ChangeHandler: firstNameChangeHandler,
    BlurHandler: firstNameBlurHandler,
    ClearHandler: firstNameClearHandler,
  } = useInput(validateLength);

  const {
    text: lastName,
    shouldDisplayError: lastNameHasError,
    errorText: lastNameErrorText,
    ChangeHandler: lastNameChangeHandler,
    BlurHandler: lastNameBlurHandler,
    ClearHandler: lastNameClearHandler,
  } = useInput(validateLength);

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
    firstNameClearHandler();
    lastNameClearHandler();
    emailClearHandler();
    passwordClearHandler();
  };

  const dispatch = useAppDispatch();
  const { isLoading, isSuccessful } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccessful) {
      dispatch(reset());
      clearForm();
      navigate('/login');
    }
  }, [isSuccessful, dispatch])

  const RegisterHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      firstNameHasError ||
      lastNameHasError ||
      emailHasError ||
      passwordHasError
    )
      return;
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      email.length === 0 ||
      password.length === 0
    )
      return;

    const newUser: NewUser = { firstName, lastName, email, password };
    
    //call the register method which is a createAsyncThunk on authSlice
    dispatch(register(newUser));
  };

  if (isLoading) return <CircularProgress />

  return (
    <FormLayout>
      <Box sx={{ width: "50%" }}>
        <form onSubmit={RegisterHandler}>
          <Grid container direction="column" justifyContent="flex-end">
            <Typography variant="h4" align="center">
              Register
            </Typography>

            <ReutilizableInput
              id="firstName"
              label="First name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              shouldDisplayError={firstNameHasError}
              errorText={firstNameErrorText}
              onChange={firstNameChangeHandler}
              onBlur={firstNameBlurHandler}
              onClear={firstNameClearHandler}
            />

            <ReutilizableInput
              id="lastName"
              label="Last name"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              shouldDisplayError={lastNameHasError}
              errorText={lastNameErrorText}
              onChange={lastNameChangeHandler}
              onBlur={lastNameBlurHandler}
              onClear={lastNameClearHandler}
            />

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
                color="success"
                disabled={
                  !firstNameHasError &&
                  !lastNameHasError &&
                  !emailHasError &&
                  !passwordHasError &&
                  firstName &&
                  lastName &&
                  email &&
                  password
                }
              >
                Sign Up
              </ReutilizableButton>
            </Typography>
          </Grid>
        </form>

        <Divider
          sx={{ borderColor: "#f5a425", width: "100%", borderBottomWidth: 1 }}
        />

        <Typography sx={{ marginTop: 2, textAlign: "center" }}>
          <small>
            Already have an account? Then{" "}
            <Link to="/login" style={{ color: "#f5a425" }}>
              sign in
            </Link>
            !{" "}
          </small>
        </Typography>
      </Box>
    </FormLayout>
  );
};

export default RegisterForm;
