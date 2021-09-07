import { Response, Request } from "express";
import { BaseTask, Task, TaskDetail } from "../types/task";
import TaskModel from "../models/task";
import * as moment from 'moment'
import { validationResult } from 'express-validator';

const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const todos = await TaskModel.listAll();
    res.status(200).json({ todos })
  } catch (error) {
    throw error
  }
}

const addTodo = async (req: Request, res: Response) => {
  try {

    const newTodo = await TaskModel.create();
    const allTodos = await TaskModel.listAll();

    res
      .status(201)
      .json({ message: "Todo added", todo: newTodo, todos: allTodos })
  } catch (error) {
    throw error
  }
}
const updateTodo = async (req: Request, res: Response) => {
  try {
    const {
      params: { user },
      body,
    } = req
    const updateTodo = await TaskModel.update();
    const allTodos = await TaskModel.listAll();
    res.status(200).json({
      message: "Todo updated",
      todo: updateTodo,
      todos: allTodos,
    })
  } catch (error) {
    throw error
  }
}

const deleteTodo = async (req: Request, res: Response) => {
  try {
    const deletedTodo = await TaskModel.del();
    const allTodos = await TaskModel.listAll();
    res.status(200).json({
      message: "Todo deleted",
      todo: deletedTodo,
      todos: allTodos,
    })
  } catch (error) {
    throw error
  }
}

export { getTodos, addTodo, updateTodo, deleteTodo }