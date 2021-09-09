import {RegisterUser, User} from "../types/user";
import dbService from "../services/db";
import {OkPacket, QueryError, RowDataPacket} from 'mysql2';

const UserModel = {
  create: (user: RegisterUser) : Promise<number | null> => new Promise((resolve, reject) => {
    const queryString = `INSERT INTO User (email, name, password, role) VALUES (?, ?, ?, ?)`;

    dbService.query(
      queryString,
      [user.email, user.name, user.password, user.role],
      (err, result) => {
        // console.log("createV2", err, result)
        if (err) return reject(err);

        const insertId = (result as OkPacket).insertId;
        resolve(insertId);
      }
    );
  }),
  findOne: (email: string) : Promise<User | null> => new Promise((resolve, reject) => {
    const queryString = `SELECT * from User WHERE email=?`;

    dbService.query(queryString, email, (err, result) => {
      // console.log("findOneV2", err, result)
      if (err) return reject(err);

      if (!(result as RowDataPacket).length) return resolve(null);

      const row = (result as RowDataPacket)[0];
      const user: User = {
        id: row.id,
        email: row.email,
        name: row.name,
        password: row.password,
        role: row.role
      };
      resolve(user);
    });
  }),
  findAll: () : Promise<Array<User> | null> => new Promise((resolve, reject) => {
    const queryString = `SELECT * from User`;

    dbService.query(queryString, (err, result) => {
      // console.log("findOneV2", err, result)
      if (err) return reject(err);

      if (!(result as RowDataPacket[]).length) return resolve(null);

      const rows = (result as RowDataPacket[]);
      const users: Array<User> = [];
      rows.forEach(row => {
        users.push({
          id: row.id,
          email: row.email,
          name: row.name,
          password: row.password,
          role: row.role
        })
      });

      resolve(users);
    });
  }),
  update: (user: User) : Promise<QueryError | null> => new Promise((resolve, reject) => {
    const queryString = `UPDATE User SET name=?, role=?, password=? WHERE email=?`;

    dbService.query(queryString, [user.name, user.role, user.password, user.email], (err) => {
      if (err) return reject(err);

      resolve(null)
    })
  })
};

export default UserModel
