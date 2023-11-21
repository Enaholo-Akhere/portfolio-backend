import { decodedData } from './../types/types.user';
import jwt from "jsonwebtoken";
import config from 'config';
import { winston_logger } from "../utils/logger";

type NewType = ArrayBuffer | SharedArrayBuffer | {
    valueOf(): ArrayBuffer | SharedArrayBuffer;
}

const PRIVATE_KEY = process.env.PRIVATE_KEY as string
const PUBLIC_KEY = process.env.PUBLIC_KEY as string

const publicKey = Buffer.from(PUBLIC_KEY, 'base64').toString('ascii');
const privateKey = Buffer.from(PRIVATE_KEY, 'base64').toString('ascii');

console.log('enaholo', process.env.ENAHOLO);





const writeJwt = (object: Object, options?: jwt.SignOptions | undefined) => {
    const jwtSign = jwt.sign(object, privateKey, {
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
        winston_logger.error(error.message, error);
        return {
            decoded: {},
            expired: error.message === 'jwt expired',
            message: error.message,
        }
    }
};

export { writeJwt, readJwt }