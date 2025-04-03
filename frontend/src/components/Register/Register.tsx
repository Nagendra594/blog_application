import classes from "./Register.module.css";
import { useReducer } from "react";
import { Form, redirect, useNavigation, useActionData, ActionFunctionArgs } from "react-router-dom";
import { AuthModel } from "../../models/AuthModel";
import { APIResponseModel } from "../../models/APIResponseModel";
import { register } from "../../services/AuthServices";
import { EmailState, PasswordState, UserNameState, ActionState } from "../../models/LoginOrRegisterModel"


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
const userNameReducerFunction = (state: UserNameState, action: ActionState) => {
  return {
    username: action.value,
    isValid: action.value.trim().length >=3,
    touched: true,
  };
};


const Register = () => {
  const navigation = useNavigation();
  const actionData = useActionData();
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
  return (

    <section className={classes.form}>
      <Form method="POST">
        {actionData && (
          <p
            style={{ color: actionData.status === 200 ? "green" : "red" }}
          >
            {actionData.message}
          </p>
        )}
        <input
          type="text"
          name="userName"
          placeholder="User Name"
          onChange={changeHandler}
          className={
            !userNameIsValid
              ? `${classes.input} ${classes.danger}`
              : classes.input
          }
          required
        />
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
            !userNameIsValid ||
            navigation.state === "loading" ||
            !emailState.touched ||
            !passwordState.touched ||
            !usernameState.touched
          }
        >
          {navigation.state === "submitting" ? "submitting" : "Sign up"}
        </button>
      </Form>
      <hr />

      <a href="/login" className={classes.createBtn}>
        Already have an account?
      </a>
    </section>

  );
};

export default Register;

export const signUpAction = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const userName = formData.get("userName");
  const signUpData: AuthModel = {
    email: email as string,
    password: password as string,
    userName: userName as string
  }
  const response: APIResponseModel<null> = await register(signUpData);
  if (response.status === 409) {
    return {
      message: "user already exists",
      status: response.status,
    };
  }
  if (response.status === 500) {
    return {
      message: "server error",
      status: response.status,
    };
  }
  if (response.status===422){
    return{
      message:"invalid details",
      status:response.status
    }
  }
  return redirect("/login/?m=now you can login");
};
