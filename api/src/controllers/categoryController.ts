import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import CategoryModel from '../models/category';
import message from '../message'
import { handleGlobalError, sendSuccessResponse } from '../utils/responder';


/**
 * Create a new category.
 * Validates the request body, checks for existing categories, and saves the new category.
 * @param req Request object
 * @param res Response object
 */
const createCategory = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Validation error
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { name, slug } = req.body;

        // Check if a category with the same name already exists
        const existingCategory = await CategoryModel.findOne({ name });
        if (existingCategory) {
            throw { status: 400, message: message.ALREADY_EXIST };
        }

        // Create category
        const category = new CategoryModel({ name, slug });
        await category.save();
        sendSuccessResponse(res, message.OK, message.CATEGORY_CREAED_SUCC, category);
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
const getCategories = async (_req: Request, res: Response) => {
    try {
        // Retrieve all categories from the database
        const findCategory = await CategoryModel.find();
        sendSuccessResponse(res, message.OK, message.Success, findCategory);
    } catch (error) {
        res.status(500).json({ status: message.Failed, error: error });
    }
};

export { createCategory, getCategories };
