import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import message from '../message'
import expenseModel from '../models/expense';
import { handleGlobalError } from '../utils/responder';


/**
 * Create a new category.
 * Validates the request body, checks for existing categories, and saves the new category.
 * @param req Request object
 * @param res Response object
 */
const addExpence = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }
        const { title, amount, users, paidBy, groupId, image, paidAt } = req.body;

        const expense = new expenseModel({
            title,
            amount,
            users,
            paidBy,
            groupId,
            image,
            paidAt,
        });

        await expense.save();
        res.status(201).send({
            status: message.OK,
            message: message.EXPENSE_CREATED_SUCC,
            data: expense,
        });
    } catch (error: any) {
        handleGlobalError(error, res, message);
    }
};


/**
 * Get all categories.
 * Fetches all categories from the database and sends them in the response.
 * @param _req Request object
 * @param res Response object
 */
const getExpence = async (_req: Request, res: Response) => {
    try {
        // Retrieve all categories from the database
        const findExpence = await expenseModel.find();
        res.status(200).send({
            status: message.OK,
            message: message.Success,
            data: findExpence,
        });
    } catch (error) {
        res.status(500).json({ status: message.Failed, error: error });
    }
};

/**
 * Update an existing expense.
 * Validates the request body and updates the expense with the provided ID.
 * @param req Request object with the expense ID in params and updated data in body
 * @param res Response object
 */
const updateExpense = async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { title, amount, users, paidBy, groupId, image, paidAt } = req.body;
        const expenseId = req.params.id; // Assuming the expense ID is in the route params

        const updatedExpense = await expenseModel.findByIdAndUpdate(
            expenseId,
            {
                title,
                amount,
                users,
                paidBy,
                groupId,
                image,
                paidAt,
            },
            { new: true }
        );

        if (!updatedExpense) {
            throw { status: 404, message: message.NO_DATA_FOUND };
        }

        res.status(200).send({
            status: message.OK,
            message: message.EXPENSE_UPDATED_SUCC,
            data: updatedExpense,
        });
    } catch (error: any) {
        if (error?.status && error.message) {
            res.status(error.status).json({ status: message.Failed, error: error.message });
        } else {
            res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
        }
    }
};

/**
 * Delete an existing expense.
 * Deletes the expense with the provided ID.
 * @param req Request object with the expense ID in params
 * @param res Response object
 */
const deleteExpense = async (req: any, res: Response) => {
    try {
        const expenseId = req.params.id; // Assuming the expense ID is in the route params

        const deletedExpense = await expenseModel.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            throw { status: 404, message: message.NO_DATA_FOUND };
        }

        res.status(200).send({
            status: message.OK,
            message: message.EXPENSE_DELETED_SUCC,
            data: deletedExpense,
        });
    } catch (error: any) {
        if (error?.status && error.message) {
            res.status(error.status).json({ status: message.Failed, error: error.message });
        } else {
            res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
        }
    }
};

export { addExpence, getExpence, updateExpense, deleteExpense };
