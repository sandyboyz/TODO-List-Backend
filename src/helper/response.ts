import moment from 'moment-timezone';
import CONSTANT from './constant';

interface ResponseData {
  requestTime: string,
  responseTime: string,
  message: string,
  data: any,
  error: any,
}

const RESPONSE = (requestTime: string, message: string, data: any = null, error: any = null) : ResponseData => {
  return {
    requestTime,
    message,
    data,
    error,
    responseTime: moment().tz(CONSTANT.WIB).format(CONSTANT.DATE_FORMAT),
  }
};

export default RESPONSE
