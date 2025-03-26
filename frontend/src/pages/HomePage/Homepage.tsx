import { Outlet, Form } from "react-router";
import classes from "./HomePage.module.css";
import UserContext from "../../context/userContext.js";
import { useContext } from "react";
import Loader from "../../components/UI/Loader/Loader";
const MainNavigation = () => {
  const ctx = useContext(UserContext);
  return (
    <>
      <header className={classes.header}>
        <h1>Hey {ctx.loading ? <Loader /> : ctx.userName}</h1>
        <Form method="POST">
          <button className={classes.logoutBtn}>Logout</button>
        </Form>
      </header>
      <Outlet />
    </>
  );
};
export default MainNavigation;
