import express from "express";
import * as bodyParser from "body-parser";
import userRouter from "./routes/user";
import LOGGER from './helper/logger';
import CONSTANT from './helper/constant';
import cors from 'cors';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '2mb'}));
app.use(cors());

app.use("/user", userRouter);

app.listen(CONSTANT.PORT, () => {
  LOGGER.Info(`Node server started running in PORT ${CONSTANT.PORT}`);
});
