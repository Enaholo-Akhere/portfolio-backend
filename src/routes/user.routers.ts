import express from 'express';

import { createUser, deleteUserAccount, editUserDetails, forgotPassword, getAllVisitors, loginUser, resetPassword } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema, editPasswordSchema, emailUserSchema, loginUserSchema, userIDSchema, } from '../zod-schema/zod.user.schema';
import { decode_jwt } from '../middleware/user-check';

const router = express.Router();

router.get('/all-visitors', decode_jwt, getAllVisitors);

router.post('/register', validate(createUserSchema), createUser);

router.post('/login', validate(loginUserSchema), loginUser);

router.put('/edit/:userID', [decode_jwt, validate(userIDSchema)], editUserDetails);

router.delete('/delete-user-account/:userID', [decode_jwt, validate(userIDSchema)], deleteUserAccount);

router.post('/request-reset-password', [decode_jwt, validate(emailUserSchema)], forgotPassword);

router.post('/set-new-password/:resetToken', [decode_jwt, validate(editPasswordSchema)], resetPassword)

export default router;

