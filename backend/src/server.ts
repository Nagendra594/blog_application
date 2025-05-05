import db from "./config/dbConfig";
import { app } from "./index";
import dotenv from "dotenv";
dotenv.config();

const run = async () => {
    try {
        const connection = await db.connect();
        connection.release();
        app.listen(process.env.PORT);
    } catch (err) {
        console.log(err)
    }
}
run();
