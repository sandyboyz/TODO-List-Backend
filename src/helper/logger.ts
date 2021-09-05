import moment from 'moment-timezone';
import CONSTANT from "./constant";

const Info = (text: string) : void => {
  console.log(moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat)+' >> INFO::'+text)
};

const Debug = (text: string) : void => {
  console.log(moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat)+' >> DEBUG::'+text)
};

const Error = (text: string) : void => {
  console.log(moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat)+' >> ERROR::'+text)
};

const LOGGER = {
  Info, Debug, Error
};

export default LOGGER
