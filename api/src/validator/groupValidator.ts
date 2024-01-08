import { body, param } from 'express-validator';

export const groupValidator = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('currencyId').isMongoId().withMessage('Invalid currencyId'),
    body('categoryId').isMongoId().withMessage('Invalid categoryId'),
    body('participants').isArray().withMessage('Participants must be an array'),
    // Add more validation rules as needed

];

export const addExpenceValidator = [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('users').optional().isMongoId().withMessage('Invalid user ID'),
    body('paidBy').optional().isMongoId().withMessage('Invalid paidBy ID'),
    body('groupId').isMongoId().withMessage('Invalid group ID'),
    body('image').optional().isString().withMessage('Image must be a string'),
    body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
];

export const updateExpenceValidator = [
    param('expenceId').notEmpty().isMongoId().withMessage('Invalid expense ID'), // Assuming you are using MongoDB ObjectId
    body('title').optional().withMessage('Title is required'),
    body('amount').optional().isNumeric().withMessage('Amount must be a number'),
    body('users').optional().isMongoId().withMessage('Invalid user ID'),
    body('paidBy').optional().isMongoId().withMessage('Invalid paidBy ID'),
    body('groupId').isMongoId().withMessage('Invalid group ID'),
    body('image').optional().isString().withMessage('Image must be a string'),
    body('date').optional().isISO8601().toDate().withMessage('Invalid date format'),
];

