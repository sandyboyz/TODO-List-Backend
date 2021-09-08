import RESPONSE from '../helper/response';
import tokenService from '../services/token';
import {Request, Response, NextFunction} from 'express';
import CONSTANT from '../helper/constant';
import moment from 'moment-timezone'
import LOGGER from '../helper/logger';
import {PayloadUser} from '../types/user';

const authMiddleware = (req: Request, res: Response, next: NextFunction) : void => {
  const requestTime = moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT);
  let payload;

  try {
    payload = tokenService.verifyTokenAuth(req);
    if (!payload) throw new Error('verify token false');

    res.locals.payload = payload  as PayloadUser;
    next()
  } catch (e) {
    LOGGER.Error(e as string);
    res.status(401).json(RESPONSE(requestTime, 'User is not verified'))
  }
};

export default authMiddleware;
