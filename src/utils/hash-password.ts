import bcrypt from 'bcrypt';
import config from 'config';
import { winston_logger } from './logger';

const hash_password = async (password: string) => {
    try {
        const salt_round = await bcrypt.genSalt(config.get<number>('saltRoundFactor'))
        const new_password = await bcrypt.hash(password, salt_round);
        return new_password;
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack)
    }
}

export default hash_password;