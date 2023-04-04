import { Button, CircularProgress, Grid, Link, Switch } from "@mui/material";
import { DataGrid, GridApi, GridCellValue } from "@mui/x-data-grid";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { selectedUser } from "../../store/slices/authSlice";
import { useAppSelector } from "../hooks/reduxHooks";
import FormLayout from "../layouts/FormLayout";

const Subjects = () => {
  const { jwt } = useAppSelector(selectedUser);
  const [subjects, setSubjects] = useState<any>(null);
  const [areSubjectsLoading, setAreSubjectsLoading] = useState<boolean>(true);

  const getSubjects = useCallback(async (): Promise<any> => {
    const subjects = await axios
      .get(`${process.env.REACT_APP_BASE_API}/subjects`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((subjects) => subjects.data);

    const withAddedTeachers = await Promise.all(
      subjects.map(async (subject: any) => ({
        ...subject,
        teacherName: await getTeacher(subject.user_id),
      }))
    );
    setSubjects(withAddedTeachers);
    setAreSubjectsLoading(false);
  }, []);

  const getTeacher = async (user_id: string) => {
    const teacher = await axios
      .get(`${process.env.REACT_APP_BASE_API}/users/${user_id}`, {
        headers: { Authorization: `Bearer ${jwt?.access_token}` },
      })
      .then((teacher) => teacher.data)
      .then((data) => {
        return data.firstName + " " + data.lastName;
      })
      .catch(() => {
        return null;
      });

    return teacher;
  };

  useEffect(() => {
    getSubjects().catch(console.error);
  }, [getSubjects]);

  if (areSubjectsLoading) return <CircularProgress />;

  return (
    <FormLayout>
      <div style={{ height: "400px", width: "100%" }}>
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
            <DataGrid
              rows={subjects}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
                  flex: 1,
                  align: "center",
                  headerAlign: "center",
                  renderCell: (params) => {
                    return (
                      <Link
                        component={RouterLink}
                        to={`${params.id}`}
                        color="secondary"
                      >
                        {params.value}
                      </Link>
                    );
                  },
                },
                {
                  field: "description",
                  headerName: "Description",
                  flex: 2,
                  align: "center",
                  headerAlign: "center",
                },
                {
                  field: "teacherName",
                  headerName: "Associated Teacher",
                  flex: 1,
                  align: "center",
                  headerAlign: "center",
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              sx={{ color: "whitesmoke" }}
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
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
                      component={RouterLink} 
                      to="/subjects/new"
                      sx={{ marginRight: "10px" }}
                    >
                      New  Subject
                    </Button>
                  </Grid>
                </Grid>
    </FormLayout>
  );
};

export default Subjects;
