import {Request, Response} from "express";
import { RegisterUser, LoginUser, User, BaseUser, PayloadUser, ResponseUser } from '../types/user';
import {BaseOneTimeToken} from '../types/oneTimeToken';
import UserModel from "../models/user";
import OneTimeTokenModel from '../models/oneTimeToken';
import RESPONSE from '../helper/response';
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
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const newUser: RegisterUser = req.body;
    newUser.role = 2;
    try {
      const similarUser = await UserModel.findOne(newUser.email);
      if (similarUser) return res.status(400).json(RESPONSE(requestTime, 'User with given email is already exists'));

      const password = newUser.password;
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);

      await UserModel.create(newUser);
      const responseUser = {
        email: newUser.email,
        name: newUser.name,
        password
      };
      return res.status(201).json(RESPONSE(requestTime, 'Register new user success', responseUser))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  },
  login: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const loggedUser: LoginUser = req.body;
    try {
      const user = await UserModel.findOne(loggedUser.email);
      if (!user) return res.status(400).json(RESPONSE(requestTime, 'Email or password is incorrect'));
      const isMatch = await bcrypt.compare(loggedUser.password, (user as User).password);
      if (!isMatch) return res.status(400).json(RESPONSE(requestTime, 'Email or password is incorrect'));

      const token = tokenService.signTokenAuth(user.email, user.role);
      return res.status(200).json(RESPONSE(requestTime, 'Login success', {token}))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  },
  resetPassword: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const baseUser: BaseUser = req.body;
    try {
      const user = await UserModel.findOne(baseUser.email);
      if (!user) return res.status(400).json(RESPONSE(requestTime, 'Email is not registered'));

      const token = uuidV4();
      const oneTimeToken: BaseOneTimeToken = {
        token,
        user: baseUser
      };
      await OneTimeTokenModel.deleteOneByUser(baseUser.email);
      await OneTimeTokenModel.create(oneTimeToken);

      const html = EMAIL_CONTENT.resetEmail(user.name, token);
      await emailService.sendEmail(user.email, 'Reset Password Confirmation', html);
      return res.status(200).json(RESPONSE(requestTime, 'Request reset password success'))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  },
  confirmResetPassword: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(RESPONSE(requestTime, 'Value in body missing the validation requirement', null, errors.array()));

    const token = req.query.t;
    const {newPassword} = req.body;
    try {
      const oneTimeToken = await OneTimeTokenModel.findOneByToken(token as string);
      if (!oneTimeToken) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'));
      const user = await UserModel.findOne((oneTimeToken as BaseOneTimeToken).user.email);
      if (!user) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'));

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await UserModel.update(user);
      await OneTimeTokenModel.deleteOneByToken(token as string);
      return res.status(200).json(RESPONSE(requestTime, 'Reset password success'))
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  },
  confirmResetPasswordPage: async (req: Request, res: Response) : Promise<Response | void> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'));

    const token = req.query.t;
    try {
      const oneTimeToken = await OneTimeTokenModel.findOneByToken(token as string);
      if (!oneTimeToken) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'));
      const user = await UserModel.findOne((oneTimeToken as BaseOneTimeToken).user.email);
      if (!user) return res.status(404).json(RESPONSE(requestTime, 'Invalid url'));

      res.render('confirm-reset-password')
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  },
  // ADMIN OR USER BASED ON ROLE PAYLOAD
  fetchData: async (req: Request, res: Response) : Promise<Response> => {
    const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
    const {email, role} = res.locals.payload as PayloadUser;

    try {
      if (role === 1) {
        const users = await UserModel.findAll();
        if (!users) return res.status(404).json(RESPONSE(requestTime, 'User data not found'));

        const responseUser: Array<ResponseUser> = [];
        users.forEach(user => {
          responseUser.push({
            id: user.id,
            email: user.email,
            name: user.name,
          })
        });
        return res.status(200).json(RESPONSE(requestTime, 'Fetch user data success', responseUser))
      } else {
        const user = await UserModel.findOne(email);
        if (!user) return res.status(404).json(RESPONSE(requestTime, 'User data not found'));

        const responseUser: ResponseUser = {
          id: user.id,
          email: user.email,
          name: user.name,
        };
        return res.status(200).json(RESPONSE(requestTime, 'Fetch user data success', responseUser))
      }
    } catch (e) {
      LOGGER.Error(e as string);
      return res.status(500).json(RESPONSE(requestTime, 'Internal server error', null, e))
    }
  }
};

export default userAPI
