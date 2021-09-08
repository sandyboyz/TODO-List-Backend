import RESPONSE from '../helper/response';
import tokenService from '../services/token';
import {Request, Response, NextFunction} from 'express';
import CONSTANT from '../helper/constant';
import moment from 'moment-timezone'
import LOGGER from '../helper/logger';
import {PayloadUser} from '../types/user';
import UserModel from '../models/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  let payload;

  try {
    payload = tokenService.verifyTokenAuth(req);
    if (!payload) throw new Error('verify token false');

    payload = payload as PayloadUser;
    const user = await UserModel.findOne(payload.email);
    if (!user) throw new Error('user not found');

    payload.role = user.role;
    res.locals.payload = payload;
    next()
  } catch (e) {
    LOGGER.Error(e as string);
    res.status(401).json(RESPONSE(requestTime, 'User is not verified'))
  }
};

export default authMiddleware;
