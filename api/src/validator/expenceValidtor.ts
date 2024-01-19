import { body } from 'express-validator';
import mongoose from 'mongoose';

export const isValidObjectId = (value: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array) => mongoose.Types.ObjectId.isValid(value);

export const expenseValidator = [
    body('title').notEmpty().withMessage('title  cannot be empty'),
    body('amount').notEmpty().withMessage('amount  cannot be empty'),
    body('paidBy')
        .notEmpty().withMessage('paidBy cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid paidBy format'),
    body('groupId')
        .notEmpty().withMessage('groupId cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid groupId format')
];
