import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

let pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST || "127.0.0.1",
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "password",
        database: process.env.MYSQL_DATABASE || "sre_remote",
        port: process.env.MYSQL_PORT || "3306",
    })
    .promise();

async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("SQL connecting success");
        connection.release();
    } catch (err) {
        console.error("SQL connecting error: ", err);
    }
}

checkConnection();

export { pool };
