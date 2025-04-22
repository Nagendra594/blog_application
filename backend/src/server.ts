import db from "./config/dbConfig";
import { app } from "./index";

const run = async () => {
    try {
        const connection = await db.connect();
        connection.release();
        app.listen(8080);
    } catch (err) {
        console.log(err)
    }
}
run();
