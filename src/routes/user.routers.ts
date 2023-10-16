import express from 'express';

import { createUser } from '../controller/users.controller';
import validate from '../DTO_validations/zod-validate';
import { createUserSchema } from '../zod-schema/zod.user.schema';

const router = express.Router();

router.post('/register', validate(createUserSchema), createUser);

// router.post('/login', 'something cooming here');

// router.put('/edit', 'something cooming here');

// router.delete('/delete', 'something will here');

export default router;

