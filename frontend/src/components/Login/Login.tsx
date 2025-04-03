import classes from "./Login.module.css";
import React, { useReducer } from "react";
import Loader from "../UI/Loader/Loader";
import { Form, redirect, useNavigation, useActionData, ActionFunctionArgs, Navigation ,useSearchParams} from "react-router-dom";
import { APIResponseModel } from "../../models/APIResponseModel";
import { login } from "../../services/AuthServices"
import { AuthModel } from "../../models/AuthModel";
import { EmailState, PasswordState, ActionState } from "../../models/LoginOrRegisterModel"

const emailReducerFunction = (state: EmailState, action: ActionState) => {
  return {
    email: action.value,
    isValid: action.value.includes("@"),
    touched: true,
  };
};
const passwordReducerFunction = (state: PasswordState, action: ActionState) => {
  return {
    password: action.value,
    isValid: action.value.trim().length >=8,
    touched: true,
  };
};
interface ActionDataType {
  message: string;
  status: number;
}
const Login = () => {
  const [queryParams]=useSearchParams();
  const navigation: Navigation = useNavigation();
  const actionData = useActionData<ActionDataType | null>();
  const [emailState, emailDispatch] = useReducer(emailReducerFunction, {
    email: "",
    isValid: false,
    touched: false,
  });
  const [passwordState, passwordDispatch] = useReducer(
    passwordReducerFunction,
    { password: "", isValid: false, touched: false }
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
  const message=queryParams.get("m");
  return (

    <section className={classes.form}>
      {message&&<p style={{color:"green"}}>{message}</p> }
      <Form method="POST">
        {actionData && (
          <p style={{ color: "red" }}>{actionData.message}</p>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={emailState.email}
          onChange={changeHandler}
          className={
            !emailInputIsValid
              ? `${classes.input} ${classes.danger}`
              : classes.input
          }
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={passwordState.password}
          onChange={changeHandler}
          className={
            !passwordInputIsValid
              ? `${classes.input} ${classes.danger}`
              : classes.input
          }
          required
        />
        <button
          className={classes.logBtn}
          disabled={
            !emailInputIsValid ||
            !passwordInputIsValid ||
            navigation.state === "submitting" ||
            !emailState.touched ||
            !passwordState.touched
          }
        >
          {navigation.state === "submitting" ? <Loader /> : "Log in"}
        </button>
        <a href="/login" className={classes.fgt}>
          Forgotten password?
        </a>
      </Form>
      <hr />

      <a href="/register" className={classes.createBtn}>
        Create new account
      </a>
    </section>

  );
};

export default Login;

export const LoginAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const loginData: AuthModel = {
    email: email as string,
    password: password as string,
  };
  const response: APIResponseModel<null> = await login(loginData);


  if (response.status === 500) {
    return {
      message: "server error",
      status: response.status,
    };

  } else if (response.status === 404) {
    return {
      message: "User does not exists, Please signup!",
      status: response.status,
    };
  }else if(response.status===401){
    return {
      message: "wrong password",
      status: response.status,
    };
  }else if(response.status!==200){
    return{
      message:"somthing wrong",
      status:response.status
    }
  }
  localStorage.setItem("isLogged", "true");
  return redirect("/");
};
