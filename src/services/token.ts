import * as jwt from 'jsonwebtoken';
import {SignOptions, VerifyOptions} from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import LOGGER from '../helper/logger';
import {Request} from 'express';

dotenv.config();

// if use RS256 algorithm
// ssh-keygen -t rsa -b 2048 -f jwtRS256.key
// openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub

// TODO-List-Backend - use HSA256 (secret key)
// MD5 - b55e9fce280a8fa9703e7639d24ccdaf
// SHA1 - 9920ffc8dfc47a754c3eb2852b91733a1d81cc42
const secretKey = process.env.SECRET_KEY || 'TODO-List-Backend';

const signOptions: SignOptions = {
    issuer: 'TODO List Backend',
    subject: 'hello@krisna.tech',
    audience: 'https://krisna.tech',
    expiresIn: 60 * 60 * 2,
    // algorithm: 'RS256'
};

const verifyOptions: VerifyOptions = {
    issuer: 'TODO List Backend',
    subject: 'hello@krisna.tech',
    audience: 'https://krisna.tech',
    // algorithms: ['RS256'],
};

interface Payload {
    email: string
}

const sign = (payload: Payload) => {
    return jwt.sign(payload, secretKey, signOptions)
};

const verify = (token: string) => {
    try {
        return jwt.verify(token, secretKey, verifyOptions)
    } catch (e) {
        LOGGER.Error(e as string);
        return false
    }
};

const tokenService = {
    signTokenAuth: (email: string) : string | null => {
        const payload: Payload = {email};
        const token = sign(payload);

        return token ? token : null
    },
    verifyTokenAuth: (req: Request) : boolean => {
        try {
            const authHeader = req.header('Authorization') || '';
            const sessionToken = authHeader.split(' ')[1];
            const sessionCode = authHeader.split(' ')[0];

            if (sessionCode && sessionCode !== 'Bearer') return false;
            return verify(sessionToken) as boolean
        } catch (e) {
            LOGGER.Error(e as string);
            return false
        }
    }
};

export default tokenService
