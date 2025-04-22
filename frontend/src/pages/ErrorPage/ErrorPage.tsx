import classes from "./ErrorPage.module.css"
import { Link } from "react-router-dom";
const ErrorPage = () => {
    return <div className={classes.notFoundContainer}>
        <h1>500</h1>
        <div className={classes.info}>
            <h2>It's not you, It's us</h2>
            <Link to="/" target="_blank">Home</Link>
        </div>
    </div>
}

export default ErrorPage;
