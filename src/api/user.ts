import {Request, Response} from "express";
import {RegisterUser, User, ResponseUser} from "../types/user";
import UserModel from "../models/user";
import response from '../helper/response';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';
import {validationResult} from 'express-validator';
import * as bcrypt from 'bcryptjs';
import LOGGER from '../helper/logger';

const userAPI = {
  register: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const newUser: RegisterUser = req.body;
    try {
      const similarUser = await UserModel.findOne(newUser.email);
      if (similarUser !== null) return res.status(400).json(response(requestTime, 'User with given email is already exists'));

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);

      const id = await UserModel.create(newUser);
      return res.status(201).json(response(requestTime, 'Register new user success', id, null))
    } catch (e) {
      LOGGER.Error(<string>e);
      return res.status(500).json(response(requestTime, 'Internal server error', null, e))
    }
  }
};

export default userAPI
