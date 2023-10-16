import { Response, Request } from "express";
import { createUserService } from "../services/users.services";
import { userRegData } from "../types/types.user";


const createUser = async (req: Request<{}, {}, userRegData>, res: Response) => {
    const userData = req.body as userRegData
    const result = await createUserService(userData);
    console.log('result', result);

    return res.json(result)
}

export { createUser }