import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser } from '../services/user';
import { createUserPayload } from '../validators/user';

export const createUserAccount = async (req: Request, res: Response) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return (res as any).fail(
        'Validation failed',
        'VALIDATION_ERROR',
        errors.array(),
        400
      );
    }

  try {
    const userPayload = createUserPayload(req);
    const user = await createUser(userPayload);
    return (res as any).success('User created successfully', user, 201);
  } catch (error) {
    return (res as any).fail(
      'Failed to create user',
      'CREATE_USER_ERROR',
      (error as any).message,
      500
    );
  }
};


