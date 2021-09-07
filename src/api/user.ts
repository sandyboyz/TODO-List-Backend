import {Request, Response} from "express";
import { RegisterUser, LoginUser, User, ResponseUser, BaseUser } from '../types/user';
import {BaseOneTimeToken} from '../types/oneTimeToken';
import UserModel from "../models/user";
import OneTimeTokenModel from '../models/oneTimeToken';
import response from '../helper/response';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';
import LOGGER from '../helper/logger';
import EMAIL_CONTENT from '../helper/emailContent';
import {validationResult} from 'express-validator';
import * as bcrypt from 'bcrypt';
import tokenService from '../services/token';
import {v4 as uuidV4} from 'uuid';
import emailService from '../services/email';

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
  login: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const loggedUser: LoginUser = req.body;
    try {
      const user = await UserModel.findOne(loggedUser.email);
      const isMatch = await bcrypt.compare(loggedUser.password, (user as User).password);
      if (!user || !isMatch) return res.status(400).json(response(requestTime, 'Email or password is incorrect'));

      // user = <ResponseUser>user
      const token = tokenService.signTokenAuth(loggedUser.email);
      return res.status(200).json(response(requestTime, 'Login success', {token}))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(response(requestTime, 'Internal server error', null, e))
    }
  },
  resetPassword: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const baseUser: BaseUser = req.body;
    try {
      const user = await UserModel.findOne(baseUser.email);
      if (!user) return res.status(400).json(response(requestTime, 'Email is not registered'));

      const token = uuidV4();
      const oneTimeToken: BaseOneTimeToken = {
        token,
        user: baseUser
      };
      await OneTimeTokenModel.deleteOneByUser(baseUser.email);
      await OneTimeTokenModel.create(oneTimeToken);

      const html = EMAIL_CONTENT.resetEmail(user.name, token);
      await emailService.sendEmail(user.email, 'Reset Password Confirmation', html);

      return res.status(200).json(response(requestTime, 'Request reset password success', oneTimeToken))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(response(requestTime, 'Internal server error', null, e))
    }
  },
  confirmResetPassword: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(response(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const token = req.query.t;
    const {newPassword} = req.body;
    try {
      const oneTimeToken = await OneTimeTokenModel.findOneByToken(token as string);
      if (!oneTimeToken) return res.status(404).json(response(requestTime, 'Invalid url'));
      const user = await UserModel.findOne((oneTimeToken as BaseOneTimeToken).user.email);
      if (!user) return res.status(404).json(response(requestTime, 'Invalid url'));

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await UserModel.update(user);
      await OneTimeTokenModel.deleteOneByToken(token as string);
      return res.status(200).json(response(requestTime, 'Reset password success'))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(response(requestTime, 'Internal server error', null, e))
    }
  },
  confirmResetPasswordPage: (req: Request, res: Response) : Response | void => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json(response(requestTime, 'Invalid url'));

    res.render('confirm-reset-password')
  }
};

export default userAPI
