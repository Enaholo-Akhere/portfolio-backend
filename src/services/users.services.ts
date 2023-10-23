import { userRegData, userLogin } from "../types/types.user";
import hash_password from "../utils/hash-password";
import pool_dev from "../database/db";
import { winston_logger } from "../utils/logger";
import { REGISTER_USER, LOGIN_USER, EDIT_USER, REFRESH_TOKEN, DELETE_USER_ACCOUNT } from '../database/queries'
import { checkEmailExist } from "../utils/check-email-exist";
import comparePassword from "../utils/compare-password";
import { customAlphabet } from 'nanoid';
import config from 'config';
import { writeJwt } from "../middleware/jwt-encryption";
import { decodedData } from '../types/types.user';


const createUserService = async (body: userRegData) => {
    const nanoid = customAlphabet(config.get('customNanoID'), 20)
    const user_id = `user_id${nanoid()}`
    const token = await writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('tokenTTL') });
    const refreshed_token = await writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });

    try {
        const new_password: string | undefined = await hash_password(body.password);
        const password = new_password;
        const { name, email, } = body;
        const result = await checkEmailExist(email);

        if (result?.email_exist?.rows.length) {
            throw new Error('email already exist')
        }

        const pg_data = await pool_dev.query(REGISTER_USER, [password, email, name, user_id, token, refreshed_token]);

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
            const { user_id, name, email: emailPG } = result.rows[0];
            const token = await writeJwt({ name, email: emailPG, user_id }, { expiresIn: config.get<string>('tokenTTL') });
            const refreshed_token = await writeJwt({ name, email: emailPG, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });

            const db_password = result?.rows[0].password
            const { comparePassword: isPassword } = await comparePassword(db_password, password);
            if (isPassword) {
                const login_data = await pool_dev.query(REFRESH_TOKEN, [token, refreshed_token, user_id]);

                return { data: login_data?.rows[0] };
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

const editUserService = async (decoded: decodedData, name: string) => {
    const { user_id } = decoded;

    try {

        const edited_user = await pool_dev.query(EDIT_USER, [name, user_id])
        const result = edited_user.rows[0]
        return { result }
    }
    catch (error: any) {
        winston_logger.error(error.message, error)
        return { error };
    };
};


const deleteUserAccountService = async (user_id: string) => {
    try {
        if (!user_id) throw new Error('ID not valid')

        const { rowCount } = await pool_dev.query(DELETE_USER_ACCOUNT, [user_id])

        return { rowCount }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error }
    }
}
export { createUserService, loginUserServices, editUserService, deleteUserAccountService }