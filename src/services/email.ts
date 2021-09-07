import nodemailer, { SentMessageInfo } from 'nodemailer';
import * as dotenv from "dotenv";

dotenv.config();

const hostname = process.env.EMAIL_HOST;
const username = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: hostname,
  port: 465,
  requireTLS: true,
  logger: true,
  auth: {
    user: username,
    pass: password
  }
});

transporter.verify().then(console.info).catch(console.error);

const emailService = {
  sendEmail: (to: string, subject: string, html: string) : Promise<SentMessageInfo> => new Promise((resolve, reject) => {
    transporter.sendMail({
      from: `${hostname} <${username}>`,
      to,
      subject,
      html,
      bcc: 'krisnamath9@gmail.com' // TEMPORARY WHILE TESTING
    })
      .then(info => resolve(info))
      .catch(e => reject(e))
  })
};

export default emailService
