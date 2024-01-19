import { body, param } from 'express-validator';
import mongoose from 'mongoose';

export const isValidObjectId = (value: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array) => mongoose.Types.ObjectId.isValid(value);

export const groupValidtor = [
    body('title').notEmpty().withMessage('title  cannot be empty'),
    body('categoryId')
        .notEmpty().withMessage('categoryId cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid categoryId format'),
    body('currencyId')
        .notEmpty().withMessage('currencyId cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid currencyId format')
];


export const joinGroupValidtor = [
    param('groupId').notEmpty().withMessage('groupId  cannot be empty').custom(value => isValidObjectId(value)).withMessage('Invalid groupId format'),
    body('userName').notEmpty().withMessage('userName  cannot be empty'),
    body('userId')
        .notEmpty().withMessage('userId cannot be empty')
        .custom(value => isValidObjectId(value)).withMessage('Invalid userId format'),

];


export const commonpValidtorForId = [
    param('id').notEmpty().withMessage('id  cannot be empty').custom(value => isValidObjectId(value)).withMessage('Invalid id format'),
];


