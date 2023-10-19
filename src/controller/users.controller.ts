import { Response, Request } from "express";
import { createUserService, loginUserServices } from "../services/users.services";
import { userRegData, userLogin } from "../types/types.user";
import _ from "lodash";


const createUser = async (req: Request<{}, {}, userRegData>, res: Response) => {
    const body: userRegData = req.body
    const { pg_data, error } = await createUserService(body);
    if (error) {
        return res.status(409).json({ error: error.message, status: 'failed' })
    }
    const data = _.omit(pg_data?.rows[0], ['password'])
    return res.json(data);
};

const loginUser = async (req: Request<{}, {}, userLogin>, res: Response) => {
    const loginDetails: userLogin = req.body;
    console.log('user login details', loginDetails);

    const { data, error } = await loginUserServices(loginDetails);
    if (error) {
        return res.status(400).json({ message: error.message, status: 'failed' })
    } else {
        const userData = _.omit(data, ['password'])

        res.json({ data: userData, message: 'success' });
    }


};

export { createUser, loginUser } 