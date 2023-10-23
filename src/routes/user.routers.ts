import express from 'express';

import { createUser, deleteUserAccount, editUserDetails, loginUser } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema, loginUserSchema, userIDSchema, } from '../zod-schema/zod.user.schema';
import { decode_jwt } from '../middleware/user-check';

const router = express.Router();

router.post('/register', validate(createUserSchema), createUser);

router.post('/login', validate(loginUserSchema), loginUser);

router.put('/edit/:userID', [decode_jwt, validate(userIDSchema)], editUserDetails);

router.delete('/delete-user-account/:userID', [decode_jwt, validate(userIDSchema)], deleteUserAccount);

export default router;

