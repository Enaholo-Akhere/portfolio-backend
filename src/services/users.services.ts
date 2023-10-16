import { userRegData } from "../types/types.user";
import bcrypt from 'bcrypt';
import config from 'config';


const createUserService = async (input: userRegData) => {
    const salt_round = await bcrypt.genSalt()

    try {
        const data = await { ...input };
        return data
    }
    catch (error: any) {
        throw new Error(error)
    }

}

export { createUserService }