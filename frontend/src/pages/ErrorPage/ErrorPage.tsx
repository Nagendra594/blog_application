import classes from "./ErrorPage.module.css"
import { Link } from "react-router-dom";
const ErrorPage=()=>{
    return<div className={classes.notFoundContainer}>
        <h1>404</h1>
        <div className={classes.info}>
            <h2>We can't find that page</h2>
            <p>We're fairly sure that page used to be here, but seems to have gone missing. We do apologise on its behalf.</p>
            <Link to="/" target="_blank">Home</Link>
        </div>
    </div>
}

export default ErrorPage;
