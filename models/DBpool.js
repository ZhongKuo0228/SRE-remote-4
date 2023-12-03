import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

let pool = mysql
    .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: 3306,
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

export default pool;
