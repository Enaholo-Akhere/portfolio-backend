import express from 'express';

import { createUser, loginUser } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema, loginUserSchema } from '../zod-schema/zod.user.schema';

const router = express.Router();

router.post('/register', validate(createUserSchema), createUser);

router.post('/login', validate(loginUserSchema), loginUser);

// router.put('/edit', 'something cooming here');

// router.delete('/delete', 'something will here');

export default router;

