import { ThemeProvider } from "@emotion/react";
import { theme } from "./shared/utils/theme";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

import { Container } from "@mui/material";
import { Fragment } from "react";
import Header from "./components/Header";

import "./App.css";
import Users from "./components/users/Users";
import Unauthorized from "./components/UI/Unauthorized";

import { useAppDispatch, useAppSelector } from "./components/hooks/reduxHooks";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { refreshTokens } from "./store/slices/authSlice";
import Subjects from "./components/subjects/Subjects";
import SubjectDetail from "./components/subjects/SubjectDetail";
import NewSubject from "./components/subjects/NewSubject";

const tokenTimeValidator = (data:string) => {

  const decodedJwt:any = jwtDecode(data);
  const dateOfExpiration:number = decodedJwt.exp * 1000;
  const dateNow:number = new Date().getTime();
  const isTokenStillValid:boolean = dateOfExpiration > dateNow;

  return isTokenStillValid;
}

function App() {

  const dispatch = useAppDispatch();
  const { isAuthenticated, user, jwt } = useAppSelector((state) => state.auth);

  axios.interceptors.request.use(
    (req) => {
      if (req.headers?.Authorization) {
        const validationResult = tokenTimeValidator(String(req.headers.Authorization).replace('Bearer ',''));
        if (!validationResult) {
          dispatch(refreshTokens(jwt?.refresh_token? jwt.refresh_token : ""));
        }
      }
      return req;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  axios.interceptors.response.use(
    (resp) => {
      if (resp.data.access_token) {
        const validationResult = tokenTimeValidator(resp.data.access_token);
        if (!validationResult) {
          dispatch(refreshTokens(jwt?.refresh_token? jwt.refresh_token : ""));
        }
        
      }

      return resp;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  return (
    <Fragment>
      <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Header />
            <Container className="contentBackground">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/login" element={isAuthenticated? <Navigate to="/home" /> : <Login />} />
                <Route path="/register" element={isAuthenticated? <Navigate to="/home" /> : <Register />} />
                <Route path="/users" element={(isAuthenticated && user?.role === "admin") ? <Users /> : <Navigate to="/unauthorized" />} />
                <Route path="/subjects" element={(isAuthenticated && user?.role === "admin") ? <Subjects /> : <Navigate to="/unauthorized" />}/>
                <Route path="/subjects/:id" element={(isAuthenticated && user?.role === "admin") ? <SubjectDetail /> : <Navigate to="/unauthorized" />}/>
                <Route path="/subjects/new" element={(isAuthenticated && user?.role === "admin") ? <NewSubject /> : <Navigate to="/unauthorized" />}/>
              </Routes>
            </Container>
          </BrowserRouter>
      </ThemeProvider>
    </Fragment>
  );
}

export default App;
