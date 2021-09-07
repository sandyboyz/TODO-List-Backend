import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import userRouter from "./routes/user";
import LOGGER from './helper/logger';
import cors from 'cors';

const app = express();
dotenv.config();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

app.use("/user", userRouter);

const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 3000;

app.listen(PORT, () => {
  LOGGER.Info(`Node server started running in PORT ${PORT}`);
});
