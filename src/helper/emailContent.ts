import CONSTANT from './constant';

const EMAIL_CONTENT = {
  resetEmail: (name: string, token: string) => {
    const link = `${CONSTANT.baseURL}/user/confirm-reset-password?t=${token}`;
    return `
            ${name === '' ? 'Hi there!' : `Dear ${name},`}
            <br><br>
            We just got a request to reset your account's password...
            <br>
            If it was not you, please let us know by replying to this email!
            <br><br>
            To continue your reset password request, please click the link below. 
            <br>
            <a href="${link}">Click on me!</a>
            <br><br>
            Thank you and good bye! 👋
            <br><br>
            Warm regards,
            <br>
            Squad II-11
        `
  },
};

export default EMAIL_CONTENT
