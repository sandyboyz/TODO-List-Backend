import mysql from "mysql2";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(__dirname, '../../.env')});

const dbService = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: <number><unknown>process.env.DB_PORT
});

export default dbService
