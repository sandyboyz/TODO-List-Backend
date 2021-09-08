import * as jwt from 'jsonwebtoken';
import { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import CONSTANT from '../helper/constant';
import LOGGER from '../helper/logger';
import {Request} from 'express';
import {PayloadUser} from '../types/user';


// if use RS256 algorithm
// ssh-keygen -t rsa -b 2048 -f jwtRS256.key
// openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

// TODO-List-Backend - use HSA256 (secret key)
// MD5 - b55e9fce280a8fa9703e7639d24ccdaf
// SHA1 - 9920ffc8dfc47a754c3eb2852b91733a1d81cc42

const signOptions: SignOptions = {
    issuer: CONSTANT.AUTHOR,
    subject: CONSTANT.EMAIL_USER,
    audience: CONSTANT.BASE_URL,
    expiresIn: CONSTANT.TOKEN_EXPIRY_SECOND,
    // algorithm: 'RS256'
};

const verifyOptions: VerifyOptions = {
    issuer: CONSTANT.AUTHOR,
    subject: CONSTANT.EMAIL_USER,
    audience: CONSTANT.BASE_URL,
    // algorithms: ['RS256'],
};

const sign = (payload: PayloadUser) => {
    return jwt.sign(payload, CONSTANT.SECRET_KEY, signOptions)
};

const verify = (token: string) => {
    try {
        return jwt.verify(token, CONSTANT.SECRET_KEY, verifyOptions)
    } catch (e) {
        LOGGER.Error(e as string);
        return false
    }
};

const tokenService = {
    signTokenAuth: (email: string, role: number) : string | null => {
        const payload: PayloadUser = {email, role};
        const token = sign(payload);

        return token ? token : null
    },
    verifyTokenAuth: (req: Request) : JwtPayload | string | false => {
        try {
            const authHeader = req.header('Authorization') || '';
            const sessionToken = authHeader.split(' ')[1];
            const sessionCode = authHeader.split(' ')[0];

            if (sessionCode && sessionCode !== 'Bearer') return false;
            return verify(sessionToken)
        } catch (e) {
            LOGGER.Error(e as string);
            return false
        }
    },
};

export default tokenService
