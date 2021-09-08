import { BaseTask, Task, TaskDetail } from "../types/task";
import db from "../services/db";
import { OkPacket, QueryError, RowDataPacket } from 'mysql2';
import { PayloadUser, User } from '../types/user';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';

const create = (task: BaseTask): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "INSERT INTO Task (user, description,image, dueDate, isComplete) VALUES (?,?,?,?,?)";
  db.query(
    queryString,
    [task.user.email, task.description, task.image, task.dueDate, task.isComplete],
    (err, result) => {
      if (err) return reject(err);

      const insertId = (result as OkPacket).insertId;
      resolve(insertId);
    }
  );
});

const findOne = (id: number) : Promise<Task | null> => new Promise((resolve, reject) => {
  const queryString = `SELECT * from Task WHERE id=?`;

  console.log(id);
  db.query(queryString, id, (err, result) => {
    // console.log("findOneV2", err, result)
    if (err) return reject(err);

    console.log(result);
    if (!(result as RowDataPacket).length) return resolve(null);

    const row = (result as RowDataPacket)[0];
    const task: Task = {
      id: row.id,
      user: {email: row.user},
      description: row.description,
      dueDate: moment(row.dueDate).format(CONSTANT.DATE_FORMAT),
      image: row.image,
      isComplete: row.isComplete,
    };
    resolve(task);
  });
});

const update = (task: Task): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "UPDATE Task SET description=?,image=?, dueDate=?, isComplete = ?  WHERE id=?";

  db.query(
    queryString,
    [task.description, task.image, task.dueDate, task.isComplete, task.id],
    (err, result) => {
      if (err) return reject(err);
      const insertId = (result as OkPacket).insertId;
      resolve(insertId);
    }
  );
});

const del = (id: number): Promise<QueryError | null> => new Promise((resolve, reject) => {
  const queryString = "DELETE FROM Task WHERE id=?";

  db.query(queryString, id, (err) => {
    if (err) return reject(err);

    resolve(null)
  });
});

const listAll = (user: PayloadUser): Promise<Array<Task> | null> => new Promise((resolve, reject) => {
  const queryString = "SELECT * FROM Task WHERE user = ?";
  db.query(queryString, user.email, (err, result) => {
    if (err) return reject(err);

    if (!(result as RowDataPacket[]).length) return resolve(null);

    const rows = (result as RowDataPacket[]);

    const tasks: Array<Task> = [];
    rows.forEach(row => {
      tasks.push({
        id: row.id,
        user: row.user,
        description: row.description,
        dueDate: moment(row.dueDate).format(CONSTANT.DATE_FORMAT),
        image: row.image,
        isComplete: row.isComplete
      })
    });
    resolve(tasks)
  });
});

const TaskModel = {
  create, update, del, listAll, findOne
};

export default TaskModel;
