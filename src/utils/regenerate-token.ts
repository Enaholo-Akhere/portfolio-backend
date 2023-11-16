import { decodedData } from './../types/types.user';
import config from 'config';
import { writeJwt } from '../middleware/jwt-encryption';
import { winston_logger } from './logger';
import { REFRESH_TOKEN } from '../database/queries';
import _ from 'lodash';
import pool from '../database/db';

const regenerate_token = async ({ name, email, user_id }: decodedData) => {

    try {
        const token = await writeJwt({ name, email, user_id }, { expiresIn: config.get<string>('tokenTTL') });
        const refreshed_token = await writeJwt({ name, email, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });
        const { rows: result } = await pool.query(REFRESH_TOKEN, [token, refreshed_token, user_id]);
        const editedData = _.omit(result[0], ['password']);

        return { editedData }
    }
    catch (error: any) {
        winston_logger.error(error.message, error)
        return { error }
    }
}

export { regenerate_token }