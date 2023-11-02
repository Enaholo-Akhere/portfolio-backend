import express from 'express';

import { createUser, deleteUserAccount, editUserDetails, forgotPassword, getAllVisitors, googleSignup, loginUser, logoutUser, resetPassword } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema, editPasswordSchema, emailUserSchema, googleSignupUserSchema, loginUserSchema, userIDSchema, } from '../zod-schema/zod.user.schema';
import { decode_jwt } from '../middleware/user-check';

const router = express.Router();

router.get('/all-visitors', decode_jwt, getAllVisitors);

router.post('/register', validate(createUserSchema), createUser);

router.post('/google-signup', validate(googleSignupUserSchema), googleSignup);

router.post('/login', validate(loginUserSchema), loginUser);

router.put('/edit/:userID', [decode_jwt, validate(userIDSchema)], editUserDetails);

router.delete('/delete-user-account/:userID', [decode_jwt, validate(userIDSchema)], deleteUserAccount);

router.post('/request-reset-password', [decode_jwt, validate(emailUserSchema)], forgotPassword);

router.post('/set-new-password/:resetToken', [decode_jwt, validate(editPasswordSchema)], resetPassword);

router.put('/logout', decode_jwt, logoutUser);


export default router;

