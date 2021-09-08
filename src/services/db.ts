import mysql from "mysql2";
import CONSTANT from '../helper/constant';

const dbService = mysql.createConnection({
  host: CONSTANT.DB_HOST,
  user: CONSTANT.DB_USER,
  password: CONSTANT.DB_PWD,
  database: CONSTANT.DB_NAME,
  port: CONSTANT.DB_PORT
});

export default dbService
