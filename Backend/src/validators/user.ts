import { Schema } from 'express-validator';
import { Request } from 'express';
import { CreateUserDto } from '../dtos/user';

export const createUserSchema: Schema = {
  email: {
    in: 'body',
    isEmail: {
      errorMessage: 'Invalid email format',
    },
    contains: {
      options: '@',
      errorMessage: 'Email must contain @ symbol',
    },
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
  password: {
    in: 'body',
    isLength: {
      options: { min: 8 },
      errorMessage: 'Password must be at least 8 characters long',
    },
    matches: {
      options:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      errorMessage:
        'Password must contain at least one lowercase letter, one uppercase letter, one number, and one symbol',
    },
    notEmpty: {
      errorMessage: 'Password is required',
    },
  },
  first_name: {
    in: 'body',
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
  last_name: {
    in: 'body',
    isString: {
      errorMessage: 'Name must be a string',
    },
    notEmpty: {
      errorMessage: 'Name is required',
    },
  },
};

export const createUserPayload = (req: Request): CreateUserDto => {
  return {
    email: req.body.email,
    password: req.body.password,
    first_name: `${req.body.first_name}`,
    last_name: `${req.body.last_name}`,
  };
};
