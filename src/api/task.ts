import { Response, Request } from 'express';
import { BaseTask, Task } from '../types/task';
import TaskModel from '../models/task';
import RESPONSE from '../helper/response';
import { PayloadUser } from '../types/user';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';
import LOGGER from '../helper/logger';
import {validationResult} from 'express-validator';

const getTodos = async (req: Request, res: Response): Promise<Response> => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  const {email, role} = res.locals.payload;
  const payload: PayloadUser = {email, role};

  try {
    const todos = await TaskModel.listAll(payload);
    if (!todos) return res.status(404).json(RESPONSE(requestTime, 'Task data not found', []));

    return res.status(200).json(RESPONSE(requestTime, 'Fetch user data success', todos))
  } catch (e) {
    LOGGER.Error(e as string);
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
  }
};

const addTodo = async (req: Request, res: Response) : Promise<Response> => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

  const {email, role} = res.locals.payload;
  const payload: PayloadUser = {email, role};
  const {description, dueDate} = req.body;
  try {
    // if (err) return res.status(422).json(RESPONSE(requestTime, 'Image upload error'));
    const file = req.file;
    if (!file) return res.status(400).json(RESPONSE(requestTime, 'Value in file missing the validation requirement', null, [{msg: 'Please provide a file', param: 'file', location: 'body'}]));

    const task: BaseTask = {
      description,
      dueDate,
      image: file.path,
      isComplete: false,
      user: payload
    };
    await TaskModel.create(task);
    return res.status(201).json(RESPONSE(requestTime, 'Add new task success', task))
  } catch (e) {
    LOGGER.Error(e as string);
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
  }
};

const updateTodo = async (req: Request, res: Response) : Promise<Response> => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

  const {email, role} = res.locals.payload;
  const payload: PayloadUser = {email, role};
  const task: Task = req.body;
  task.id = req.query.id as unknown as number;
  task.user = payload;
  try {
    const file = req.file;
    if (!file && Object.keys(task).length <= 1) return res.status(400).json(RESPONSE(requestTime, 'There is nothing to changes'));

    const currentTask = await TaskModel.findOne(task.id);
    if (!currentTask) return res.status(404).json(RESPONSE(requestTime, 'Task not found'));

    if (file) currentTask.image = file.path;
    if (task.description) currentTask.description = task.description;
    if (task.dueDate) currentTask.dueDate = task.dueDate;
    if (task.isComplete) currentTask.isComplete = task.isComplete;

    await TaskModel.update(currentTask);
    return res.status(201).json(RESPONSE(requestTime, 'Add new task success', currentTask))
  } catch (e) {
    LOGGER.Error(e as string);
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
  }
};

const deleteTodo = async (req: Request, res: Response) : Promise<Response> => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

  const {id} = req.query;
  try {
    await TaskModel.del(id as unknown as number);
    return res.status(200).json(RESPONSE(requestTime, 'Delete task data success'))
  } catch (e) {
    LOGGER.Error(e as string);
    return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
  }
};

const taskAPI = { getTodos, addTodo, updateTodo, deleteTodo}

export default taskAPI;
