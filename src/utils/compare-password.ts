import bcrypt from 'bcrypt';
import { winston_logger } from './logger';

const comparePassword = async (db_password: string, password: string) => {

    try {
        const comparePassword = await bcrypt.compare(password, db_password)

        return { comparePassword };
    }
    catch (error: any) {
        winston_logger.error(error.message, error)
        return { error }
    }
}

export default comparePassword;