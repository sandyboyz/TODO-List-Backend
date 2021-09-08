import * as env from 'dotenv';

env.config();

const CONSTANT = {
  AUTHOR: 'Squad II-11',
  WIB: 'Asia/Jakarta',
  DATE_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  TOKEN_EXPIRY_SECOND: 60 * 60 * 2,
  PORT: process.env.NODE_ENV === 'production' ? process.env.PORT as unknown as number || 3000 : 3000,
  BASE_URL: process.env.BASE_URL  as string || 'http://localhost:3000',
  SECRET_KEY: process.env.SECRET_KEY as string || 'TODO-List-Backend',
  NODE_ENV: process.env.NODE_ENV as string || 'development',
  DB_HOST: process.env.DB_HOST as string || 'localhost',
  DB_USER: process.env.DB_USER as string || 'root',
  DB_PWD: process.env.DB_PWD as string || 'root',
  DB_NAME: process.env.DB_NAME as string || 'db',
  DB_PORT: process.env.DB_PORT as unknown as number | 3000,
  EMAIL_HOST: process.env.EMAIL_HOST as string || 'smtp.mail.com',
  EMAIL_USER: process.env.EMAIL_USER as string || 'user@mail.com',
  EMAIL_PASS: process.env.EMAIL_PASS as string || 'pass',
  EMAIL_PORT: process.env.EMAIL_PORT as unknown as number || 587
};

export default CONSTANT
