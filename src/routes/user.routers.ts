import express from 'express';

import { createUser, deleteUserAccount, downloadResume, editUserDetails, forgotPassword, getAllVisitors, googleSignup, loginUser, logoutUser, messageMe, resetPassword, verifyUser } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema, editPasswordSchema, editUserSchema, emailUserSchema, googleSignupUserSchema, loginUserSchema, messageSchema, userIDSchema, } from '../zod-schema/zod.user.schema';
import { decode_jwt } from '../middleware/user-check';

const router = express.Router();

router.get('/all-visitors', decode_jwt, getAllVisitors);

router.post('/register', validate(createUserSchema), createUser);

router.post('/google-signup', validate(googleSignupUserSchema), googleSignup);

router.post('/login', validate(loginUserSchema), loginUser);

router.put('/edit/:userID', [decode_jwt, validate(editUserSchema)], editUserDetails);

router.put('/verify/:userID/:token', verifyUser);

router.delete('/delete-user-account/:userID', [decode_jwt], deleteUserAccount);

router.post('/request-reset-password', validate(emailUserSchema), forgotPassword);

router.post('/set-new-password/:resetToken', validate(editPasswordSchema), resetPassword);

router.put('/logout/:userID', logoutUser);

router.get('/download-resume', decode_jwt, downloadResume);

router.post('/send-message', validate(messageSchema), messageMe)



export default router;

