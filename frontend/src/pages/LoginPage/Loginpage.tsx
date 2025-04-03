import LoginForm from "../../components/Login/Login";
import classes from "./Loginpage.module.css"
import { Navigate } from "react-router-dom";
const LoginPage = () => {
  const Compo=()=>{
    const isAuth = localStorage.getItem("isLogged");
    if(!isAuth){
      return  <main style={{ backgroundColor: "#f2f4f7" }}>
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.left}>
            <h1>Share Your Thoughts</h1>
            <p>
              This is a blog Website where you can share your thoughts and ideas
            </p>
          </div>
          <div className={classes.right}>
            <LoginForm />

            <section className={classes.bottom}>
              <p>
                <strong>Create a Page</strong> for a celebrity, brand or business.
              </p>
            </section>
          </div>
        </div>
      </div>

    </main>
    }
    return <Navigate to={"/"}/>
  }
  return <Compo/>;
};
export default LoginPage;
