import mysql from "mysql2/promise";
import config from "../config/index.js";

const pool = mysql.createPool({
  connectionLimit: 100,
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  port: config.db.port,
  multipleStatements: true,
  trace: true,
});

pool.on("connection", () => {
  console.log("db connected");
});

pool.on("enqueue", () => {
  console.log("db connection waiting");
});

pool.on("acquire", () => {
  console.log("db connection acquired");
});

pool.on("release", () => {
  console.log("db connection released");
});

pool.on("error", (err) => {
  console.error("MySQL Error: ", err);
});

let connection = await pool.getConnection();
if (connection) {
  console.log("db connected");
} else {
  console.log("db not connected");
}

export default connection;
