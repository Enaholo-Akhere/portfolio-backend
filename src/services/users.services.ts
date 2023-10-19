import { userRegData, userLogin } from "../types/types.user";
import hash_password from "../utils/hash-password";
import pool_dev from "../database/db";
import { winston_logger } from "../utils/logger";
import { REGISTER_USER, LOGIN_USER } from '../database/queries'
import { checkEmailExist } from "../utils/check-email-exist";
import comparePassword from "../utils/compare-password";
import { customAlphabet } from 'nanoid';
import config from 'config';



const createUserService = async (body: userRegData) => {
    const nanoid = customAlphabet(config.get('customNanoID'), 20)
    console.log('nanoid', nanoid());


    try {
        const new_password: string | undefined = await hash_password(body.password);
        const password = new_password;
        const { name, email, } = body;
        const result = await checkEmailExist(email);

        if (result?.email_exist?.rows.length) {
            throw new Error('email already exist')
        }


        const pg_data = await pool_dev.query(REGISTER_USER, [password, email, name]);

        return { pg_data };
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack);
        return { error }
    }

}

const loginUserServices = async (loginDetails: userLogin) => {
    const { email, password } = loginDetails;
    try {
        const result = await pool_dev.query(LOGIN_USER, [email]);

        if (result?.rows.length) {
            const db_password = result?.rows[0].password
            const { comparePassword: isPassword } = await comparePassword(db_password, password);
            if (isPassword) {
                return { data: result?.rows[0] };
            } else {
                throw new Error('Username or password incorrect');
            }

        } else {
            throw new Error('Username or password incorrect');
        }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error };
    }




};


export { createUserService, loginUserServices }