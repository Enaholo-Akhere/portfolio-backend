export { createUserInputType, loginUserInputType, editUserInputType as editUser } from './../zod-schema/zod.user.schema';

export interface userRegData {
    email: string;
    password: string;
    name: string;
}

export interface userLogin {
    password: string;
    email: string
}

export interface decodedData {
    name: string;
    email: string;
    user_id: string;
    iat?: number;
    exp?: number;
    token?: string;
    refreshed_token?: string;
}

export interface mailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
};

export interface emailUrlAndName {
    name: string;
    url: string;
}