import { Response, Request } from "express";
import { BaseTask, Task, TaskDetail } from "../types/task";
import TaskModel from "../models/task";

const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const Todos: TaskDetail = req.body;
    const todos = await TaskModel.listAll(Todos);
    res.status(200).json({ todos })
  } catch (error) {
    throw error
  }
}

const addTodo = async (req: Request, res: Response) => {
  try {
    const Todos: BaseTask = req.body;
    const Todos1: TaskDetail = req.body;
    const newTodo = await TaskModel.create(Todos);
    const allTodos = await TaskModel.listAll(Todos1);

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
    const Todos: BaseTask = req.body;
    const Todos1: TaskDetail = req.body;
    const updateTodo = await TaskModel.update(Todos);
    const allTodos = await TaskModel.listAll(Todos1);
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
    const Todos: BaseTask = req.body;
    const Todos1: TaskDetail = req.body;
    const deletedTodo = await TaskModel.del(Todos);
    const allTodos = await TaskModel.listAll(Todos1);
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