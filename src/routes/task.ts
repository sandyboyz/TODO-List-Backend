import express from 'express';
const taskRouter = express.Router();
import { body, query } from 'express-validator';
import taskAPI from "../api/task"
import authMiddleware from '../middleware/auth';
import uploadFile from '../middleware/upload'

taskRouter.get("", authMiddleware, taskAPI.getTodos);

taskRouter.post("", [
  authMiddleware,
  uploadFile.single('file'),
  body('description', 'Please provide a description').notEmpty(),
  body('dueDate', 'Please provide a description').custom(val => {
    const regex = /^[1-2]\d{3}-(0[1-9]|1[0-2])-([0-2][0-9]|3[0-1]) ([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    return val.match(regex)
  })
], taskAPI.addTodo);

taskRouter.put("", [
  authMiddleware,
  uploadFile.single('file'),
  query('id', 'Please provide a valid id').isNumeric()
], taskAPI.updateTodo);

taskRouter.delete("", [
  authMiddleware,
  query('id', 'Please provide a valid id').isNumeric()
], taskAPI.deleteTodo);

export default taskRouter;
