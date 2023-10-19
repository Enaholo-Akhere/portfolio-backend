import { winston_logger } from "../utils/logger";
import { CHECK_EMAIL_EXIST } from '../database/queries'
import pool_dev from "../database/db";

const checkEmailExist = async (email: string) => {

    try {
        const email_exist = await pool_dev.query(CHECK_EMAIL_EXIST, [email])
        return { email_exist }
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack);
        return { error }
    }
};

export { checkEmailExist }