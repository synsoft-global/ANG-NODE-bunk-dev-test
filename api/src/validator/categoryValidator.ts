import { body } from 'express-validator';

export const categoryValidator = [
    body('name').notEmpty().withMessage('Category name cannot be empty'),
    body('slug').optional().notEmpty().withMessage('Category slug cannot be empty'),
];
