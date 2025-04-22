import fs from "fs";
import path from "path";
import db from "../config/dbConfig";

const runMigrations = async () => {
    try {
        const dirPath = path.join(__dirname, "migrations");
        const files = fs.readdirSync(dirPath).sort();

        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const sql = fs.readFileSync(filePath, "utf-8");
            await db.query(sql);
        }
    } catch (err) {
        console.log(err);
    }

};

runMigrations()

