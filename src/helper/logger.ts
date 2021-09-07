import moment from 'moment-timezone';
import CONSTANT from "./constant";

const customLog = (type: string, text: string) : void => {
  console.log(`${moment().tz(CONSTANT.WIB).format(CONSTANT.dateFormat)} >> ${type}::${text}`);
};

const LOGGER = {
  Info: (text: string) : void => {
    customLog("INFO", text)
  },
  Debug: (text: string) : void => {
    customLog("DEBUG", text)
  },
  Error: (text: string) : void => {
    customLog("ERROR", text)
  }
};

export default LOGGER
