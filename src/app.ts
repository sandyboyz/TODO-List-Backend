import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import { userRouter } from "./routes/user";
import { taskRouter } from "./routes/task";
import * as logger from './helper/logger';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/task", taskRouter)

app.listen(process.env.PORT, () => {
    logger.Info("Node server started running");
});
