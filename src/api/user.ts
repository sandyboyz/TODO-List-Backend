import {Request, Response} from "express";
import {RegisterUser, LoginUser, User, ResponseUser} from "../types/user";
import UserModel from "../models/user";
import response from '../helper/response';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';
import {validationResult} from 'express-validator';
import * as bcrypt from 'bcrypt';
import LOGGER from '../helper/logger';
import tokenService from '../services/token';

const userAPI = {
  register: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const newUser: RegisterUser = req.body;
    try {
      const similarUser = await UserModel.findOne(newUser.email);
      if (similarUser) return res.status(400).json(response(requestTime, 'User with given email is already exists'));

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);

      await UserModel.create(newUser);

      return res.status(201).json(response(requestTime, 'Register new user success', newUser))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(response(requestTime, 'Internal server error', null, e))
    }
  },
  login: async (req: Request, res: Response) : Promise<Response | undefined> => {
      const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

      const loggedUser: LoginUser = req.body;
      try {
          const user = await UserModel.findOne(loggedUser.email);
          if (!user) return res.status(404).json(response(requestTime, 'User with given email does not exists'));

          const isMatch = await bcrypt.compare(loggedUser.password, (user as User).password);
          if (!isMatch) return res.status(400).json(response(requestTime, 'Incorrect password'));

          // user = <ResponseUser>user
          const token = tokenService.signTokenAuth(loggedUser.email);
          res.status(200).json(response(requestTime, 'Login success', {token}))
      } catch (e) {
          LOGGER.Error(e as string);
          return res.status(500).json(response(requestTime, 'Internal server error', null, e))
      }
  }
};

export default userAPI
