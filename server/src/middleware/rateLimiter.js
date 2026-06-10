import rateLimit from 'express-rate-limit';

const skipLimiter = (req, res, next) => next();

export const authLimiter =
  process.env.NODE_ENV === 'test'
    ? skipLimiter
    : rateLimit({
        windowMs: 60 * 1000,
        max: 5,
        message: 'Too many login attempts'
      });

export const apiLimiter =
  process.env.NODE_ENV === 'test'
    ? skipLimiter
    : rateLimit({
        windowMs: 60 * 1000,
        max: 100
      });