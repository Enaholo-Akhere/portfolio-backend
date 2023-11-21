import { decodedData, messageMeInterface, resetPasswordInterface } from './../types/types.user';
import { userRegData, userLogin, forgotPassword } from "../types/types.user";
import hash_password from "../utils/hash-password";
import pool from "../database/db";
import { winston_logger } from "../utils/logger";
import { REGISTER_USER, LOGIN_USER, EDIT_USER, REFRESH_TOKEN, DELETE_USER_ACCOUNT, GET_ALL_VISITORS, CHECK_EMAIL_EXIST, REQUEST_RESET_PASSWORD, CHECK_RESET_EMAIL_EXIST, UPDATE_RESET_PASSWORD, RESET_PASSWORD, DELETE_RESET_PASSWORD, SEND_MESSAGE } from '../database/queries'
import { checkEmailExist } from "../utils/check-email-exist";
import comparePassword from "../utils/compare-password";
import { customAlphabet } from 'nanoid';
import config from 'config';
import { writeJwt } from "../middleware/jwt-encryption";
import _ from "lodash";
import { sendForgotPasswordEmail, responseMessageEmail, sendMeAMessage } from "../utils/nodemailer";
import generator from 'generate-password';
import path from 'path';
import fs from 'fs';

const NANO_CUSTOM_ID = process.env.NANO_CUSTOM_ID as string;

const createUserService = async (body: userRegData) => {
    const nanoid = customAlphabet(NANO_CUSTOM_ID, 20)
    const user_id = `user_id${nanoid()}`
    const token = writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('tokenTTL') });
    const refreshed_token = writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });

    try {
        const { new_password, error } = await hash_password(body.password);
        if (error) throw new Error('could not hash the password')
        const password = new_password;
        const { name, email, } = body;
        const result = await checkEmailExist(email);

        if (result?.email_exist?.rows.length) {
            throw new Error('email already exist')
        }

        const pg_data = await pool.query(REGISTER_USER, [password, email, name, user_id, token, refreshed_token]);

        return { pg_data };
    }
    catch (error: any) {
        winston_logger.error(error.message, error.stack);
        return { error }
    }
}

const googleSignupService = async (body: userRegData) => {
    const nanoid = customAlphabet(NANO_CUSTOM_ID, 20);
    const user_id = `user_id${nanoid()}`
    const token = writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('tokenTTL') });
    const refreshed_token = writeJwt({ ...body, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log('generated password', password);
    const error = '1234';
    const data = body;
    return { error, data }

};


const loginUserServices = async (loginDetails: userLogin) => {
    const { email, password } = loginDetails;
    try {
        const result = await pool.query(LOGIN_USER, [email]);

        if (result?.rows.length) {
            const { user_id, name, email: emailPG } = result.rows[0];
            const token = await writeJwt({ name, email: emailPG, user_id }, { expiresIn: config.get<string>('tokenTTL') });
            const refreshed_token = await writeJwt({ name, email: emailPG, user_id }, { expiresIn: config.get<string>('refreshedTokenTTL') });

            const db_password = result?.rows[0].password
            const { comparePassword: isPassword } = await comparePassword(db_password, password);
            if (isPassword) {
                const login_data = await pool.query(REFRESH_TOKEN, [token, refreshed_token, user_id]);

                return { data: login_data?.rows[0] };
            } else {
                throw new Error(' Incorrect Username or password');
            }

        } else {
            throw new Error('Incorrect Username or password');
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

        const edited_user = await pool.query(EDIT_USER, [name, user_id])
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

        const { rowCount } = await pool.query(DELETE_USER_ACCOUNT, [user_id])

        return { rowCount }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error }
    }
};

const getAllVisitorsService = async () => {
    try {
        const { rows: data } = await pool.query(GET_ALL_VISITORS);

        return { data }
    }
    catch (error: any) {
        winston_logger.error(error.message, error)
        return { error }
    }
};


const forgotPasswordService = async (email: string) => {
    try {

        const resetPasswordToken = writeJwt({ email }, { expiresIn: config.get<string>('resetPasswordTokenTTL') });
        const { rows: emailExist } = await pool.query(CHECK_EMAIL_EXIST, [email]);
        if (!emailExist.length) throw new Error('email does not exist');

        const { rows: respRows } = await pool.query(CHECK_RESET_EMAIL_EXIST, [email]);
        console.log('rep role', respRows);

        if (respRows.length) {
            const { rows } = await pool.query(UPDATE_RESET_PASSWORD, [email, resetPasswordToken]);
            const respData: forgotPassword = rows[0];


            await sendForgotPasswordEmail(respData);
            return { respData };
        } else {
            const { rows } = await pool.query(REQUEST_RESET_PASSWORD, [email, resetPasswordToken]);

            const respData: forgotPassword = rows[0];
            await sendForgotPasswordEmail(respData);

            return { respData };
        }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error };
    }
};

const resetPasswordService = async (password: string, decoded: decodedData) => {

    try {
        const { error, new_password } = await hash_password(password);

        if (error) throw new Error('could not hash the password');

        const { rows } = await pool.query(RESET_PASSWORD, [new_password, decoded?.email]);
        const data = rows[0];

        const { rowCount } = await pool.query(DELETE_RESET_PASSWORD, [decoded.email])
        return { data, rowCount }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error }
    };
};


const logoutService = async (userID: string) => {


    const token = writeJwt({}, { expiresIn: config.get<string>('logoutTTL') });
    const refreshed_token = writeJwt({}, { expiresIn: config.get<string>('logoutTTL') });

    try {
        await pool.query(REFRESH_TOKEN, [token, refreshed_token, userID]);

        const message = 'logged out successfully'
        return { message }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error }
    }
};

const downloadResumeService = async (req: any, res: any) => {

    const file = __dirname + '/upload-folder/Resume-Enaholo-Akhere.pdf';

    const filename = path.basename(file);

    res.setHeader('Content-disposition', 'attachment; filename=' + filename);

    const filestream = fs.createReadStream(file);
    filestream.pipe(res);

};

const messageMeService = async (messageMeService: messageMeInterface) => {
    const { email, name, message, subject } = messageMeService;
    try {
        const { rows } = await pool.query(SEND_MESSAGE, [email, name, message, subject]);
        const data = rows[0];
        const allPromises = [sendMeAMessage(data), responseMessageEmail(data)]

        const result = await Promise.allSettled(allPromises);

        result.forEach((result) => {
            if (result.status === 'rejected') {
                throw new Error('error got here')
            }
        })

        return { data }
    }
    catch (error: any) {
        winston_logger.error(error.message, error);
        return { error }
    }
};

export { createUserService, loginUserServices, editUserService, deleteUserAccountService, getAllVisitorsService, forgotPasswordService, resetPasswordService, googleSignupService, logoutService, downloadResumeService, messageMeService }