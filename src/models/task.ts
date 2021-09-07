import { BaseTask, Task, TaskDetail } from "../types/task";
import db from "../services/db";
import { OkPacket, RowDataPacket } from "mysql2";

const create = (task: BaseTask): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "INSERT INTO Task (description,image, dueDate, isComplete) VALUES (?,?,?,?)";
  db.query(
    queryString,
    [task.description, task.image, task.dueDate, task.isComplete],
    (err, result) => {
      if (err) return reject(err);

      const insertId = (result as OkPacket).insertId;
      resolve(null, insertId);
    }
  );
});

const update = (task: BaseTask): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "UPDATE Task SET  description=?,image=?, dueDate=?, isComplete = ?  WHERE user = ?";

  db.query(
    queryString,
    [task.description, task.image, task.image, task.dueDate, task.isComplete],
    (err, result) => {
      if (err) return resolve(err);
      resolve(null, insertId);
    }
  );
});

const del = (task: BaseTask): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "DELETE FROM Task WHERE id = ?";

  db.query(
    queryString,
    [task.description, task.image, task.image, task.dueDate, task.isComplete],
    (err, result) => {
      if (err) return resolve(err);
      resolve(null, insertId);
    }
  );
});

const listAll = (task: TaskDetail): Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = "SELECT * FROM Task WHERE user = ?";

});

const TaskModel = {
  create, update, del, listAll
};

export default TaskModel


// import { ITodo } from "../types/todo"
// import { model, Schema } from "mysql2"

// const todoSchema: Schema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       required: true,
//     },

//     status: {
//       type: Boolean,
//       required: true,
//     },
//   },
//   { timestamps: true }
// )

// export default model<ITodo>("Todo", todoSchema)