import { BaseUser, RegisterUser, User, ResponseUser } from "../types/user";
import dbService from "../services/db";
import { OkPacket, RowDataPacket } from "mysql2";

const create = (user: RegisterUser) : Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = `INSERT INTO User (email, name, password, role) VALUES (?, ?, ?, ?)`;

  dbService.query(
    queryString,
    [user.email, user.name, user.password, user.role],
    (err, result) => {
      // console.log("createV2", err, result)
      if (err !== null) return reject(err);

      const insertId = (<OkPacket> result).insertId;
      resolve(insertId);
    }
  );
});

const findOne = (email: string) : Promise<User | null> => new Promise((resolve, reject) => {
  const queryString = `SELECT * from User WHERE email=?`;

  dbService.query(queryString, email, (err, result) => {
    // console.log("findOneV2", err, result)
    if (err !== null) return reject(err);

    if ((<RowDataPacket>result).length === 0) return resolve(null);

    const row = (<RowDataPacket>result)[0];
    const user: User = {
      id: row.id,
      email: row.email,
      name: row.email,
      password: row.password,
      role: row.role
    };
    resolve(user);
  });
});

const UserModel = {
  create, findOne
};

export default UserModel
