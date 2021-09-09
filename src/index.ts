import express from "express";
import userRouter from "./routes/user";
import taskRouter from './routes/task';
import LOGGER from './helper/logger';
import CONSTANT from './helper/constant';
import cors from 'cors';
import path from 'path';

const app = express();

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.json({limit: '2mb'}));
app.use(cors());

app.use("/user", userRouter);
app.use('/task', taskRouter);

app.listen(CONSTANT.PORT, () => {
  LOGGER.Info(`Node server started running in PORT ${CONSTANT.PORT}`);
});
