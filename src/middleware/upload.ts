import multer from 'multer';
import moment from 'moment-timezone';
import CONSTANT from '../helper/constant';
import {Request, Response} from 'express'

const imageFilter = (req: Request, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../../media/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${moment().tz(CONSTANT.WIB).format('YYYY-MM-DDTHH:mm:ss')}-${file.originalname}`);
  },
});

const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
export default uploadFile
