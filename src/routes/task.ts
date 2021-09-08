import express from "express";
const taskRouter = express.Router();
import { body } from 'express-validator';
import { getTodos, addTodo, updateTodo, deleteTodo } from "../api/task"


taskRouter.get("/todo", getTodos)

taskRouter.post("/add-todo", addTodo)

taskRouter.put("/edit-todo/:id", updateTodo)

taskRouter.delete("/delete-todo/:id", deleteTodo)

export default taskRouter;