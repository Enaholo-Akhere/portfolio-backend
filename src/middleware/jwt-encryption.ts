import jwt, { JwtPayload } from "jsonwebtoken";
import config from 'config';
import { winston_logger } from "../utils/logger";


const privateKey = config.get<string>('private_key');
const publicKey = config.get<string>('public_key');

const writeJwt = async (object: Object, options?: jwt.SignOptions | undefined) => {
    const jwtSign = await jwt.sign(object, privateKey, {
        ...(options && options),
        algorithm: 'RS256',
    });

    return jwtSign;
};


const readJwt = async (token: string) => {
    try {
        const decoded = await jwt.verify(token, publicKey);
        return {
            decoded,
            expired: false,
            message: 'jwt active',

        }
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack);
        return {
            decoded: {},
            expired: error.message === 'jwt expired',
            message: error.message,
        }
    }
};

export { writeJwt, readJwt }