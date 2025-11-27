import express from 'express';
import { checkSchema } from 'express-validator';
import { createUserAccount } from '../controllers/user';
import { createUserSchema } from '../validators/user';

export const userRoutes = express.Router();

userRoutes.post('/users', checkSchema(createUserSchema), createUserAccount);
