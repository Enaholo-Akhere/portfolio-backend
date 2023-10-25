import { Response, Request } from "express";
import { createUserService, loginUserServices, editUserService, deleteUserAccountService, getAllVisitorsService, forgotPasswordService, resetPasswordService } from "../services/users.services";
import { userRegData, userLogin, decodedData } from "../types/types.user";
import _ from "lodash";
import { sendEmail } from "../utils/nodemailer";
import { readJwt } from "../middleware/jwt-encryption";
import { JwtPayload } from "jsonwebtoken";


const createUser = async (req: Request<{}, {}, userRegData>, res: Response) => {
    const body: userRegData = req.body
    const { pg_data, error } = await createUserService(body);
    if (error) {
        return res.status(409).json({ error: error.message, status: 'failed' })
    }
    const data = _.omit(pg_data?.rows[0], ['password']) as decodedData;
    await sendEmail(data);
    return res.json({ data, message: 'user registered successfully', status: 'success' });
};

const loginUser = async (req: Request<{}, {}, userLogin>, res: Response) => {
    const loginDetails: userLogin = req.body;

    const { data, error } = await loginUserServices(loginDetails);
    if (error) {
        return res.status(400).json({ message: error.message, status: 'failed' })
    } else {
        const userData = _.omit(data, ['password'])

        return res.json({ data: userData, message: 'success' });
    }

};

const editUserDetails = async (req: Request, res: Response) => {
    const { userID: user_id } = req.params;
    const { name } = req.body;
    const decoded: decodedData = res.locals.user;

    if (user_id === decoded?.user_id) {

        const { result, error } = await editUserService(decoded, name);
        if (error) return res.status(400).json({ data: {}, message: error.message, status: 'failed' })
        const data = _.omit(result, ['password'])
        return res.status(200).json({ data, message: 'Edited successfully', status: 'success' })
    } else {
        return res.status(400).json({ data: {}, message: 'invalid user_ID provided', status: 'failed' })
    }
};

const deleteUserAccount = async (req: Request, res: Response) => {
    const { userID } = req.params;
    const { user_id } = res.locals.user as decodedData;


    if (userID === user_id) {
        const { error, rowCount } = await deleteUserAccountService(userID)
        if (error || !rowCount) {
            return res.status(400).json({ message: error.message, status: 'failed', data: {} })
        };

        return res.status(200).json({ message: 'account deleted successfully', status: 'success', data: {} });
    } else {
        return res.status(400).json({ message: 'user not found', status: 'failed', data: {} });

    }
};

const getAllVisitors = async (req: Request, res: Response) => {
    const { data, error } = await getAllVisitorsService();
    if (error) {
        return res.status(400).json({ data: {}, message: error.message, status: 'failed' })
    }
    return res.status(200).json({ data, message: 'all users fetched successfully', status: 'success' });

};

const forgotPassword = async (req: Request, res: Response) => {
    const decoded: decodedData = res.locals.user;
    const { email } = req.body;
    if (decoded.email === email) {

        const { respData: data, error } = await forgotPasswordService(decoded);
        if (error) return res.status(400).json({ data: {}, message: error.message, status: 'failed' });

        return res.status(200).json({ data, message: 'reset string sent to your email', status: 'success' });
    } else {
        return res.status(400).json({ message: 're-login and submit a correct email', status: 'failed' });
    }
};


const resetPassword = async (req: Request, res: Response) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    const { decoded, message, expired } = await readJwt(resetToken) as JwtPayload;

    if (expired) return res.status(401).json({ message, status: 'failed' });

    const { data, rowCount } = await resetPasswordService(password, decoded);

    if (data && rowCount) return res.status(200).json({ message: 'successful - Login with your new password', status: 'success' })
    return res.status(401).json({ message: 'nothing to reset', status: 'failed' });
};

export { createUser, loginUser, editUserDetails, deleteUserAccount, getAllVisitors, forgotPassword, resetPassword } 