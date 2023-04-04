import {
  Grid,
  Box,
  Typography,
  InputLabel,
  TextField,
  FormControl,
  FormLabel,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectedUser } from "../../store/slices/authSlice";
import useInput, {
  validateLength,
  validateDescLength,
} from "../hooks/inputAction";
import { useAppSelector } from "../hooks/reduxHooks";
import FormLayout from "../layouts/FormLayout";
import ReutilizableInput from "../UI/ReutilizableInput";
import { Link as RouterLink } from "react-router-dom";

const NewSubject = () => {
  const navigate = useNavigate();

  const { jwt } = useAppSelector(selectedUser);

  const [selectedTeacher, setSelectedTeacher] = useState<any>();
  const [allTeachers, setAllTeachers] = useState<any>(null);
  const [areTeachersLoading, setAreTeachersLoading] = React.useState<boolean>(true);
  const [radioGroupErrorText, setRadioGroupErrorText] = useState("Please select a teacher")

  const newSubjectHandler = async (e: any): Promise<any> => {
    e.preventDefault();

    const name: string = e.target.elements.name.value;
    const description: string = e.target.elements.description.value;
    const user_id: string = selectedTeacher.id;

    let updatedSubject: any = { name, description, user_id };

    await axios.post(
      `${process.env.REACT_APP_BASE_API}/subjects`,
      updatedSubject,
      { headers: { Authorization: `Bearer ${jwt?.access_token}` } }
    );

    navigate("/subjects");
  }

  const selectedTeacherHandler = (e: any) => {
    const selectedTeacher = allTeachers.find((teacher:any) => teacher.id === e.target.value)
    setSelectedTeacher(selectedTeacher);
    setRadioGroupErrorText("");
  }

  const getAllTeachers = React.useCallback(async (): Promise<any> => {
    const teachers = await axios
      .get(`${process.env.REACT_APP_BASE_API}/users/teachers`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((teachers) => teachers.data);
    setAllTeachers(teachers);
    setAreTeachersLoading(false);
  }, []);

  React.useEffect(() => {
    getAllTeachers().catch(console.error);
  }, [getAllTeachers]);

  const {
    text: name,
    shouldDisplayError: nameHasError,
    errorText: nameErrorText,
    ChangeHandler: nameChangeHandler,
    BlurHandler: nameBlurHandler,
    ClearHandler: nameClearHandler,
  } = useInput(validateLength);

  const {
    text: description,
    shouldDisplayError: descriptionHasError,
    errorText: descriptionErrorText,
    ChangeDescHandler: descriptionChangeHandler,
    BlurHandler: descriptionBlurHandler,
    ClearHandler: descriptionClearHandler,
  } = useInput(validateDescLength);

  if (areTeachersLoading)
    return (
      <FormLayout>
        <CircularProgress />
      </FormLayout>
    );

  return (
    <FormLayout>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "rgba(33, 37, 41, 0.5)",
          paddingBottom: "20px",
          borderRadius: "10px",
        }}
      >
        <Box sx={{ width: "50%" }}>
          <form onSubmit={newSubjectHandler}>
            <Grid container direction="column" justifyContent="flex-end">
              <Grid item>
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  New Subject
                </Typography>
              </Grid>
              <ReutilizableInput
                id="name"
                label="Subject name"
                type="text"
                placeholder="Enter the subject name"
                shouldDisplayError={nameHasError}
                errorText={nameErrorText}
                onChange={nameChangeHandler}
                onBlur={nameBlurHandler}
                onClear={nameClearHandler}
              />

              <InputLabel
                sx={{
                  fontWeight: 500,
                  marginTop: 2,
                  color: "#F5F5F5",
                  fontSize: 17.5,
                }}
                htmlFor="description"
              >
                Subject description
              </InputLabel>

              <TextField
                multiline
                maxRows={10}
                id="description"
                type="text"
                aria-label="maximum height"
                placeholder="Enter the subject description"
                onChange={descriptionChangeHandler}
                onBlur={descriptionBlurHandler}
                error={descriptionHasError}
                helperText={descriptionHasError ? descriptionErrorText : ""}
                sx={{
                  backgroundColor: "#F5F5F5",
                  borderRadius: "5px 5px 5px 5px",
                  fontSize: 12.5,
                }}
              />

              <FormControl error={selectedTeacher ? false : true}>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  sx={{
                    fontWeight: 500,
                    marginTop: 2,
                    color: "#F5F5F5",
                    fontSize: 17.5,
                  }}
                >
                  Teacher
                </FormLabel>
                <Paper style={{ maxHeight: 200, overflow: "auto" }}>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={selectedTeacher? selectedTeacher.id : ""}
                    onChange={selectedTeacherHandler}
                    id="availableTeachers"
                    name="radio-buttons-group"
                    sx={{ alignItems: "center", fontSize: "10px" }}
                  >
                    {allTeachers.map((teacher: any) => (
                      <FormControlLabel
                        key={teacher.id}
                        value={teacher.id}
                        control={<Radio size="small" />}
                        label={teacher.firstName + " " + teacher.lastName}
                        id={teacher.id}
                        sx={{ fontSize: 7 }}
                      />
                    ))}
                  </RadioGroup>
                  
                </Paper>
                <FormHelperText>{radioGroupErrorText}</FormHelperText>
              </FormControl>
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                sx={{
                  backgroundColor: "rgba(33, 37, 41, 0.5)",
                  paddingBottom: "20px",
                  borderRadius: "10px",
                  marginTop: "20px",
                }}
              >
                <Grid
                  item
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                  textAlign="center"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    sx={{ marginRight: "10px" }}
                    disabled={nameHasError || descriptionHasError || !name || !description || !selectedTeacher }
                  >
                    Confirm
                  </Button>

                  <Button
                    component={RouterLink} 
                    to="/subjects"
                    variant="contained"
                    color="info"
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </FormLayout>
  );
};

export default NewSubject;
