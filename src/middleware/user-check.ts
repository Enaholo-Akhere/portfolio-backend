
import { readJwt } from './jwt-encryption';
import { Response, Request, NextFunction } from 'express';
import { decodedData } from '../types/types.user';
import _ from 'lodash';
import { regenerate_token } from '../utils/regenerate-token';



const decode_jwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.get('authorization')?.split(' ')[1];
    const refreshToken = req.get('x-refresh-token');


    if (!token) return res.status(400).json({ message: 'token not found' })

    if (!refreshToken) return res.status(400).json({ message: 'token not found' })



    const { expired, message, decoded } = await readJwt(token);
    const { expired: expRef, message: mesRef, decoded: decRef } = await readJwt(refreshToken);
    const { name, email, user_id } = decRef as decodedData;

    if (expired && !expRef) {

        const { editedData, error } = await regenerate_token({ name, email, user_id })
        if (error) return res.status(400).json({ message: error.message })
        res.locals.user = editedData;
        next()

    }

    if (expired && expRef) {

        res.locals.user = {}
        return res.json({ message });
    }

    res.locals.user = decoded;
    return next();

}

export { decode_jwt }