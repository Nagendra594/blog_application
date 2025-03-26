import Register from "../../components/Register/Register";
import classes from "./Registerpage.module.css";
const RegisterPage = () => {
  return (
    <main>
      <div className={classes.container}>
        <div className={classes.content}>
          <div className={classes.left}>
            <h1>Share Your Thoughts</h1>
            <p>
              This is a blog Website where you can share your thoughts and ideas
            </p>
          </div>
          <div className={classes.right}>
            <Register />
            <section className={classes.bottom}>
              <p>
                <strong>Create a Page</strong> for a celebrity, brand or business.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};
export default RegisterPage;
