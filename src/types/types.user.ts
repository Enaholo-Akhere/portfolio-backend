
export { createUserInputType, loginUserInputType, editUserInputType as editUser } from './../zod-schema/zod.user.schema';

export interface userRegData {
    email: string;
    password: string;
    name: string;
}

export interface userLogin {
    password: string;
    email: string;
    isverified: boolean;
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
};

export interface forgotPassword {
    serial: number;
    reset_token: string;
    email: string;
}


export interface resetPasswordInterface {
    decoded: decodedData;
    message: string;
    expired: boolean;
}

export interface messageMeInterface {
    email: string;
    name: string;
    message: string;
    subject: string;
}