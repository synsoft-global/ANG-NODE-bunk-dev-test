// userValidation.ts

import { body } from 'express-validator';
import mongoose from 'mongoose';

export const signUpValidation = [
    body('userName').notEmpty().withMessage('UserName cannot be empty'),
    body('email').notEmpty().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional()
        .matches(/^\d{10}$/).withMessage('Invalid phone number format. It should be a 10-digit number.'),
];

export const loginValidation = [
    body('email').notEmpty().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const emailValidation = [
    body('emails').isArray().withMessage('Emails should be an array'),
    body('emails.*').isEmail().withMessage('Invalid email format'),
];

export const isValidObjectId = (value: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array) => mongoose.Types.ObjectId.isValid(value);

export const inviteValidation = [
    body('emails').isArray().withMessage('Emails should be an array'),
    body('emails.*').isEmail().withMessage('Invalid email format'),
    body('groupId')
        .notEmpty().withMessage('groupId cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid groupId format'),
];
