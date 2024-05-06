import { Response, Request } from "express";
import { createUserService, loginUserServices, editUserService, deleteUserAccountService, getAllVisitorsService, forgotPasswordService, resetPasswordService, googleSignupService, logoutService, downloadResumeService, messageMeService, verifyUserService } from "../services/users.services";
import { userRegData, userLogin, decodedData, messageMeInterface } from "../types/types.user";
import _ from "lodash";
import { sendEmail } from "../utils/nodemailer";
import { readJwt } from "../middleware/jwt-encryption";
import { JwtPayload } from "jsonwebtoken";
import { emailTemplate } from "../utils/email-template";


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

const googleSignup = async (req: Request, res: Response) => {
    const body: userRegData = req.body;
    const { data, error } = await googleSignupService(body);
    return res.status(200).json({ message: 'created successfully', data })
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
        if (error) return res.status(400).json({ message: error.message, status: 'failed' })
        const data = _.omit(result, ['password'])
        return res.status(200).json({ data, message: 'Edited successfully', status: 'success' })
    } else {
        return res.status(400).json({ data: {}, message: 'invalid user_ID provided', status: 'failed' })
    }
};


const verifyUser = async (req: Request, res: Response) => {
    const { userID: user_id, token } = req.params;

    if (user_id) {

        const { result, error } = await verifyUserService(user_id, token);
        if (error) return res.status(400).json({ message: error.message, status: 'failed' })

        return res.status(200).json({ message: 'Verified successfully', status: 'success' })
    } else {
        return res.status(400).json({ data: {}, message: ' cannot verify user', status: 'failed' })
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
    const decoded: decodedData = res.locals.user;
    if (Object.keys(decoded).length) {

        const { data, error } = await getAllVisitorsService();
        if (error) {
            return res.status(400).json({ data: {}, message: error.message, status: 'failed' })
        }
        return res.status(200).json({ data, message: 'all users fetched successfully', status: 'success' });
    } else {
        return res.status(400).json({ data: {}, message: 'Please login', status: 'failed' })

    }

};


const forgotPassword = async (req: Request, res: Response) => {

    const { email } = req.body;
    const { respData, error } = await forgotPasswordService(email);
    if (error) return res.status(400).json({ message: error.message, status: 'failed' });

    if (respData) return res.status(200).json({ message: 'reset string sent to your email', status: 'success' });

};


const resetPassword = async (req: Request, res: Response) => {
    const { resetToken } = req.params;
    const { password } = req.body;
    const { decoded, message, expired } = await readJwt(resetToken) as JwtPayload;

    if (expired) return res.status(401).json({ message, status: 'failed' });

    const { data, rowCount, error } = await resetPasswordService(password, decoded);

    if (error) return res.status(401).json({ message: error.message, status: 'failed' });

    if (data && rowCount) return res.status(200).json({ message: 'successful - Login with your new password', status: 'success' })
    return res.status(401).json({ message: 'nothing to reset', status: 'failed' });
};

const logoutUser = async (req: Request, res: Response) => {
    const { userID } = req.params;

    const { message, error } = await logoutService(userID);
    if (error) return res.status(404).json({ message: error.message, status: 'failed', data: {} })

    return res.status(200).json({ message, status: 'success', data: {} });
};


const downloadResume = async (req: Request, res: Response) => {
    const decoded: decodedData = res.locals.user;

    if (Object.keys(decoded).length) {
        downloadResumeService(req, res)
    } else {
        res.status(401).json({ message: 'you have to first login', status: 'failed' })
    }
};

const messageMe = async (req: Request, res: Response) => {
    const messageMeDetail: messageMeInterface = req.body;

    const { data, error } = await messageMeService(messageMeDetail);

    if (error) {
        return res.status(400).json({ message: error.message, status: 'failed' })
    };


    if (data) return res.status(200).json({ message: 'message sent successfully', status: 'success' });
};


export { messageMe, createUser, loginUser, editUserDetails, deleteUserAccount, getAllVisitors, forgotPassword, resetPassword, googleSignup, logoutUser, downloadResume, verifyUser } 