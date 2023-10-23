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


// const deleteUserAccountService = async (user_id: string) => {
//     try {
//         if (!user_id) throw new Error('ID not valid')

//         const { rowCount } = await pool_dev.query(DELETE_USER_ACCOUNT, [user_id])
//         console.log('user_delete', rowCount);

//         return { rowCount }
//     }
//     catch (error: any) {
//         winston_logger.error(error.message, error);
//         return { error }
//     }
// }

export { checkEmailExist }