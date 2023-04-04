import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
import axios from "axios";
import React, { useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { selectedUser } from "../../store/slices/authSlice";
import useInput, {
  validateLength,
  validateDescLength,
} from "../hooks/inputAction";
import { useAppSelector } from "../hooks/reduxHooks";
import FormLayout from "../layouts/FormLayout";
import ReutilizableInput from "../UI/ReutilizableInput";

const SubjectDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  const { jwt } = useAppSelector(selectedUser);
  const [subject, setSubject] = React.useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>();
  const [allTeachers, setAllTeachers] = useState<any>(null)
  const [isSubjectLoading, setIsSubjectLoading] = React.useState<boolean>(true);

  const [editMode, setEditMode] = useState(false);

  const editModeHandler = () => {
    setEditMode(!editMode);
  };

  const editConfirmHandler = async (e: any) => {
    e.preventDefault();
    const name: string = e.target.elements.name.value;
    const description: string = e.target.elements.description.value;
    const teacherName: string = selectedTeacher.firstName+" "+selectedTeacher.lastName;
    await editSubject(name, description, selectedTeacher.id, teacherName);
    await editModeHandler();
  };

  const selectedTeacherHandler = (e: any) => {
    const selectedTeacher = allTeachers.find((teacher:any) => teacher.id === e.target.value)
    setSelectedTeacher(selectedTeacher);
  }

  const getSubject = React.useCallback(async (): Promise<any> => {
    const subject = await axios
      .get(`${process.env.REACT_APP_BASE_API}/subjects/${params.id}`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((subject) => subject.data);

    const teacher = await axios
      .get(`${process.env.REACT_APP_BASE_API}/users/${subject.user_id}`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((teacher) => teacher.data);

    subject.teacherName = teacher.firstName + " " + teacher.lastName;

    setSubject(subject);
    setSelectedTeacher(teacher);
    setIsSubjectLoading(false);
  }, []);

  const editSubject = React.useCallback(
    async (name: string, description: string, selectedTeacherID: string, teacherName: string): Promise<any> => {
      let updatedSubject:any = { name, description, user_id: selectedTeacherID };
      await axios
        .patch(
          `${process.env.REACT_APP_BASE_API}/subjects/${params.id}`,
          updatedSubject,
          { headers: { Authorization: `Bearer ${jwt?.access_token}` } }
        )
      updatedSubject.teacherName = teacherName;
      setSubject(updatedSubject);
    },
    []
  );

  const deleteSubject = React.useCallback(
    async (): Promise<any> => {
      await axios
        .delete(
          `${process.env.REACT_APP_BASE_API}/subjects/${params.id}`,
          { headers: { Authorization: `Bearer ${jwt?.access_token}` } }
        );

        navigate("/subjects");
    },
    []
  );

  const getAllTeachers = React.useCallback(async (): Promise<any> => {
    const teachers = await axios
      .get(`${process.env.REACT_APP_BASE_API}/users/teachers`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((teachers) => teachers.data);
    setAllTeachers(teachers);
  }, []);

  React.useEffect(() => {
    getSubject().catch(console.error);
    getAllTeachers().catch(console.error);
  }, [getSubject, getAllTeachers]);

  const {
    text: name = subject.name,
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

  if (isSubjectLoading)
    return (
      <FormLayout>
        <CircularProgress />
      </FormLayout>
    );

  /* ------------------------------------------------------------------------- EDIT MODE ------------------------------------------------------------------------- */
  if (editMode)
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
            paddingTop: "20px",
            marginTop: "75px",
            borderRadius: "10px",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <form onSubmit={editConfirmHandler}>
              <Grid container direction="column" justifyContent="flex-end">
                <Grid item>
                  <Typography variant="h5" sx={{ textAlign: "center" }}>
                    Edit
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
                  defaultValue={subject.name}
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
                  defaultValue={subject.description}
                />

                <FormControl>
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
                      value={selectedTeacher.id}
                      onChange={selectedTeacherHandler}
                      id='availableTeachers'
                      name="radio-buttons-group"
                      sx={{ alignItems: "center",fontSize: '10px' }}
                    >
                      {allTeachers.map((teacher: any) => (
                        <FormControlLabel
                          key={teacher.id}
                          value={teacher.id}
                          control={<Radio size="small"/>}
                          label={teacher.firstName +" "+ teacher.lastName}
                          id={teacher.id}
                          sx={{fontSize: 7}}
                        />
                      ))}
                    </RadioGroup>
                  </Paper>
                </FormControl>
                <Grid
                  container
                  spacing={2}
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
                      disabled={nameHasError || descriptionHasError}
                    >
                      Confirm
                    </Button>

                    <Button
                      onClick={editModeHandler}
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

  /* ------------------------------------------------------------------------- VIEW MODE ------------------------------------------------------------------------- */
  return (
    <FormLayout>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "rgba(33, 37, 41, 0.5)",
          paddingBottom: "20px",
          borderRadius: "10px",
        }}
      >
        <Grid item>
          <Typography variant="h5">{subject.name}</Typography>
        </Grid>
        <Grid
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Card
            style={{
              backgroundColor: "#212529",
              color: "whitesmoke",
              alignItems: "center",
              width: "100%",
              borderColor: "whitesmoke",
              margin: "auto",
            }}
          >
            <CardHeader subheader="Assigned Teacher" />
            <CardContent>
              {subject.teacherName ? subject.teacherName : "wegweg"}
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
        >
          <Card
            style={{
              backgroundColor: "#212529",
              color: "whitesmoke",
              alignItems: "center",
              width: "50%",
              borderColor: "whitesmoke",
              margin: "auto",
            }}
          >
            <CardHeader subheader="Description" />
            <CardContent>{subject.description}</CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
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
            variant="contained"
            onClick={editModeHandler}
            color="warning"
            sx={{ marginRight: "10px" }}
          >
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={ ()=> { window.confirm("Are you sure you want to delete this subject?") && deleteSubject() }}>
            Delete
          </Button>
        </Grid>
      </Grid>
    </FormLayout>
  );
};

export default SubjectDetail;
