/**
 * Auth input validation.
 *
 * WHY this exists: previously req.body fields went straight into
 * Mongoose queries and bcrypt calls with zero type checking. Without
 * forcing email/password to actually be strings, a crafted body like
 * { "email": { "$ne": null }, "password": { "$ne": null } } can be cast
 * by Mongoose into a query operator instead of a literal — a classic
 * NoSQL injection that can bypass login entirely. `.isString()` /
 * `.isEmail()` here reject anything that isn't a plain string before it
 * ever reaches a database query.
 */

import { body } from 'express-validator';

const registerValidators = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').isString().trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password')
    .isString()
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
];

const loginValidators = [
  body('email').isString().trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required')
];

export { registerValidators, loginValidators };
