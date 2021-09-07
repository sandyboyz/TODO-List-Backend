import { BaseOneTimeToken, OneTimeToken } from '../types/oneTimeToken';
import dbService from "../services/db";
import { OkPacket, QueryError, RowDataPacket } from 'mysql2';

const create = (oneTimeToken: BaseOneTimeToken) : Promise<number | null> => new Promise((resolve, reject) => {
  const queryString = `INSERT INTO OneTimeToken (token, user) VALUES (?, ?)`;

  dbService.query(
    queryString,
    [oneTimeToken.token, oneTimeToken.user.email],
    (err, result) => {
      // console.log("createV2", err, result)
      if (err) return reject(err);

      const insertId = (result as OkPacket).insertId;
      resolve(insertId);
    }
  );
});

const findOne = (email = 'email', token = 'token') : Promise<BaseOneTimeToken | null> => new Promise((resolve, reject) => {
  const queryString = `SELECT * from OneTimeToken WHERE email=? AND token=?`;

  dbService.query(queryString, [email, token], (err, result) => {
    // console.log("findOneV2", err, result)
    if (err) return reject(err);
    if (!(result as RowDataPacket).length) return resolve(null);

    const row = (result as RowDataPacket)[0];
    const user: BaseOneTimeToken = {
      token: row.token,
      user: {
        email: row.user
      }
    };
    resolve(user);
  });
});

const findOneByToken = (token: string) : Promise<BaseOneTimeToken | null> => new Promise((resolve, reject) => {
  const queryString = `SELECT * from OneTimeToken WHERE token=?`;

  dbService.query(queryString, token, (err, result) => {
    // console.log("findOneV2", err, result)
    if (err) return reject(err);
    if (!(result as RowDataPacket).length) return resolve(null);

    const row = (result as RowDataPacket)[0];
    const user: BaseOneTimeToken = {
      token: row.token,
      user: {
        email: row.user
      }
    };
    resolve(user);
  });
});

const findOneByEmail = (email: string) : Promise<BaseOneTimeToken | null> => new Promise((resolve, reject) => {
  const queryString = `SELECT * from OneTimeToken WHERE email=?`;

  dbService.query(queryString, email, (err, result) => {
    // console.log("findOneV2", err, result)
    if (err) return reject(err);
    if (!(result as RowDataPacket).length) return resolve(null);

    const row = (result as RowDataPacket)[0];
    const user: BaseOneTimeToken = {
      token: row.token,
      user: {
        email: row.user
      }
    };
    resolve(user);
  });
});

const deleteOneByToken = (token: string) : Promise<QueryError | null> => new Promise((resolve, reject) => {
  const queryString = `DELETE from OneTimeToken WHERE token=?`;

  dbService.query(queryString, token, (err) => {
    if (err) return reject(err);

    resolve(null);
  });
});

const deleteOneByUser = (email: string) : Promise<QueryError | null> => new Promise((resolve, reject) => {
  const queryString = `DELETE from OneTimeToken WHERE user=?`;

  dbService.query(queryString, email, (err) => {
    if (err) return reject(err);

    resolve(null);
  });
});

const OneTimeTokenModel = {
  create, findOneByEmail, findOneByToken, deleteOneByUser, deleteOneByToken
};

export default OneTimeTokenModel
