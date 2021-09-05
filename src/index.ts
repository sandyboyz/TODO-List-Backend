import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import userRouter from "./routes/user";
import LOGGER from './helper/logger';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
  LOGGER.Info(`Node server started running in PORT ${process.env.PORT}`);
});
