import React, { useState, useReducer } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  AlertTitle,
  Link,
  CircularProgress,

} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { APIResponseModel } from "../../types/APIResponseModel";
import { login } from "../../services/AuthServices/AuthServices"
import { AuthModel } from "../../types/AuthModel";
import { EmailState, PasswordState, ActionState } from "../../types/LoginOrRegisterModel"
import { Visibility } from "@mui/icons-material";
import { Role } from "../../types/Role.type";

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

const LoginPage: React.FC = () => {

  const [queryParams] = useSearchParams();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [actionData, setActionData] = useState<{ message: string, status: number } | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [emailState, emailDispatch] = useReducer(emailReducerFunction, {
    email: "",
    isValid: false,
    touched: false,
  });
  const [passwordState, passwordDispatch] = useReducer(passwordReducerFunction, { password: "", isValid: false, touched: false }
  );

  const emailInputIsValid = emailState.isValid || !emailState.touched;
  const passwordInputIsValid = passwordState.isValid || !passwordState.touched;

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      emailDispatch({ value });
    } else {
      passwordDispatch({ value });
    }
  };
  const message = queryParams.get("m");
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  }
  const LoginAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionData(null);
    setSubmitting(true);


    const loginData: AuthModel = {
      email: emailState.email,
      password: passwordState.password
    };

    const response: APIResponseModel<Role> = await login(loginData);
    setSubmitting(false);

    if (response.status === 500) {
      setActionData({
        message: "server error",
        status: response.status,
      });


    } else if (response.status === 404) {
      setActionData({
        message: "User does not exists, Please signup!",
        status: response.status,
      });
    } else if (response.status === 401) {
      setActionData({
        message: "wrong password",
        status: response.status,
      })
    } else if (response.status !== 200) {
      setActionData({
        message: "somthing wrong",
        status: response.status
      })
    }
    else {

      localStorage.setItem("isLogged", "true");
      localStorage.setItem("role", response.data!)
      return response.data === "user" ? navigate("/") : navigate("/admin");
    }
  };





  return <Box
    sx={{
      height: "100vh",
      backgroundImage: 'url("/assets/depositphotos_84219350-stock-photo-word-blog-suspended-by-ropes.jpg")',
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundSize: "100vw 100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >

    <Paper elevation={3} sx={{ padding: 4, width: 350, }}>
      <Typography variant="h5" textAlign="center" mb={3}>
        Login
      </Typography>
      <form onSubmit={LoginAction} data-testid="form">
        {message && !actionData &&

          <Alert severity="success" sx={{
            maxWidth: "100%",
            minWidth: "50%",
          }}>
            <AlertTitle>Success</AlertTitle>
            Here is a gentle confirmation that you can logIn now.
          </Alert>


        }
        {actionData && (
          <Alert severity="error" sx={{
            width: "100%",
          }}>
            <AlertTitle>Error</AlertTitle>
            {actionData.message}
          </Alert>
        )}
        <TextField fullWidth id="Email" type="email" label="Email" variant="standard" error={!emailInputIsValid} value={emailState.email} name="email" onChange={changeHandler} margin="normal"
          required />
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




        <Stack spacing={1.5} mt={2}>
          <Button type="submit" variant="contained" color="primary" disabled={!emailInputIsValid ||
            !passwordInputIsValid ||
            submitting ||
            !emailState.touched ||
            !passwordState.touched}> {submitting ? <CircularProgress /> : "Log IN"}</Button>

          <Button variant="outlined" sx={{


            margin: "1rem",
            "&:hover": {

              backgroundColor: "#4caf50",
              color: "white",
              border: "none",

            }
          }}>
            <Link href="/register" sx={{
              textDecoration: "none", "&:hover": {
                color: "white"
              },
              width: "100%",
              height: "100%"
            }}>
              Sign Up
            </Link>
          </Button>


        </Stack>
      </form>
    </Paper>
  </Box >

};

export default LoginPage;


