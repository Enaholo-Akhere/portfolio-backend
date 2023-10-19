export { createUserInputType, loginUserInputType } from './../zod-schema/zod.user.schema';

export interface userRegData {
    email: string;
    password: string;
    name: string;
}

export interface userLogin {
    password: string;
    email: string
}
