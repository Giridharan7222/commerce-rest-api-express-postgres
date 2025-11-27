import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

export const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS),
  limit: Number(process.env.RATE_LIMIT_MAX),
  message: 'Too many requests!',
});
