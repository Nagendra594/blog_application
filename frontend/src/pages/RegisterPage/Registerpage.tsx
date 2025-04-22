import React, { useState, useReducer } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert, AlertTitle,

  Paper,
  Link,
  CircularProgress,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthModel } from "../../types/AuthModel";
import { APIResponseModel } from "../../types/APIResponseModel";
import { register } from "../../services/AuthServices/AuthServices";
import { EmailState, PasswordState, UserNameState, ActionState } from "../../types/LoginOrRegisterModel"

import { Visibility } from "@mui/icons-material";

const emailReducerFunction = (state: EmailState, action: ActionState) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    email: action.value,
    isValid: emailRegex.test(action.value),
    touched: true,
  };
};
const passwordReducerFunction = (state: PasswordState, action: ActionState) => {
  return {
    password: action.value,
    isValid: action.value.trim().length >= 8,
    touched: true,
  };
};
const userNameReducerFunction = (state: UserNameState, action: ActionState) => {
  return {
    username: action.value,
    isValid: action.value.trim().length >= 3,
    touched: true,
  };
};


const SignupPage = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionData, setActionData] = useState<{ message: string, status: number } | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [emailState, emailDispatch] = useReducer(emailReducerFunction, {
    email: "",
    isValid: false,
    touched: false,
  });

  const [passwordState, passwordDispatch] = useReducer(
    passwordReducerFunction,
    { password: "", isValid: false, touched: false }
  );
  const [usernameState, usernameDispatch] = useReducer(
    userNameReducerFunction,
    {
      username: "",
      isValid: false,
      touched: false,
    }
  );
  const emailInputIsValid = emailState.isValid || !emailState.touched;
  const passwordInputIsValid = passwordState.isValid || !passwordState.touched;
  const userNameIsValid = usernameState.isValid || !usernameState.touched;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      emailDispatch({ value: value });
      return;
    }
    if (name === "password") {
      passwordDispatch({ value: value });
      return;
    }
    usernameDispatch({ value: value });

  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const signUpAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true)
    const signUpData: AuthModel = {
      email: emailState.email,
      password: passwordState.password,
      username: usernameState.username
    }
    const response: APIResponseModel<null> = await register(signUpData);
    setSubmitting(false)
    if (response.status === 409) {

      setActionData({
        message: "user already exists",
        status: response.status,
      })
    }
    else if (response.status === 500) {
      setActionData({
        message: "server error",
        status: response.status,
      });
    }
    else if (response.status === 422) {
      setActionData({
        message: "invalid details",
        status: response.status
      })
    }
    else {
      navigate("/login/?m=t");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: 'url("/assets/depositphotos_84219350-stock-photo-word-blog-suspended-by-ropes.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundSize: "100vw 100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Sign Up
        </Typography>

        <form onSubmit={signUpAction}>
          {actionData && (

            <Alert severity={actionData.status !== 200 ? "error" : "success"}>
              <AlertTitle>{actionData.status === 200 ? "Success" : "Error"}</AlertTitle>
              {actionData.message}
            </Alert>


          )}
          <TextField type="text" variant="standard" value={usernameState.username} name="userName" onChange={changeHandler} label="Username" id="Username" error={!userNameIsValid} fullWidth margin="normal" required />

          <TextField type="email" variant="standard" value={emailState.email} name="email" onChange={changeHandler} label="Email" id="Email" error={!emailInputIsValid} fullWidth margin="normal" required />

          <Box sx={{ position: "relative" }}>

            <TextField
              fullWidth
              id="Password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="standard"
              value={passwordState.password}
              error={!passwordInputIsValid}
              name="password"
              onChange={changeHandler}
              margin="normal"

              required

            />
            <Visibility sx={{ position: "absolute", right: 0, top: "50%", translate: "0 -50%", cursor: "pointer" }} onClick={handleClickShowPassword} />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={!emailInputIsValid || !passwordInputIsValid || !userNameIsValid || submitting || !emailState.touched || !passwordState.touched || !usernameState.touched}>
            {submitting ? <CircularProgress /> : "Sign up"}
          </Button>
        </form>
        <Button variant="outlined" sx={{


          margin: "1rem",
          "&:hover": {

            backgroundColor: "#4caf50",
            color: "white",
            border: "none",

          },

        }}>
          <Link href="/login" sx={{
            textDecoration: "none", "&:hover": {
              color: "white"
            },
            width: "100%",
            height: "100%"
          }}>
            Already have an account?
          </Link>
        </Button>
      </Paper>
    </Box>
  );
};

export default SignupPage;




