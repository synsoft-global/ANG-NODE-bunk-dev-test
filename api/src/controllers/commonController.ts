import { Request, Response } from 'express';
import countries from '../data/countries';
import CountryModel from '../models/country';
import message from '../message'
import sendMail from '../helper/email';
import { validationResult } from 'express-validator';
import GroupModel from '../models/group';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responder';
import CategoryModel from '../models/category';
import categories from '../data/categories';


/**
 * Insert a list of countries into the database.
 * Uses the `insertMany` method to insert an array of countries into the CountryModel.
 * @param _req Request object
 * @param res Response object
 */
const insertCountriesToDatabase = async (_req: Request, res: Response) => {
    try {
        // Insert countries into the database using the insertMany method
        const data = await CountryModel.insertMany(countries);
        sendSuccessResponse(res, message.OK, message.Success, data);
    } catch (error) {
        sendErrorResponse(error, res, message);
    }
};

/**
 * Get the list of countries from the database.
 * Fetches all countries from the database using the find method.
 * @param _req Request object
 * @param res Response object
 */
const getCoutryList = async (_req: Request, res: Response) => {
    try {
        // Retrieve all countries from the database using the find method
        const getList = await CountryModel.find();
        sendSuccessResponse(res, message.OK, message.Success, getList);
    } catch (error) {
        sendErrorResponse(error, res, message);
    }
}


/**
 * Search for countries based on provided query parameters.
 *
 * @param {Object} req - The request object with search parameters.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the search results.
 * @throws {Object} If there is an error during the search process.
 */
const searchCountry = async (req: any, res: any) => {
    try {
        const { query } = req;

        const filter: any = {};

        if (query.name) {
            filter.name = new RegExp(query.name, 'i');
        }

        if (query.code) {
            filter.code = new RegExp(query.code, 'i');
        }

        if (query.currency) {
            filter.currency = new RegExp(query.currency, 'i');
        }

        if (query._id) {
            filter._id = query._id;
        }

        // Use the filter object in the find method
        const findData = await CountryModel.find(filter);
        sendSuccessResponse(res, message.OK, message.Success, findData);

    } catch (error: any) {
        // Handle errors and respond with a generic internal server error message
        sendErrorResponse(error, res, message);
    }
};

/**
 * Invite friends to join a group.
 *
 * Sends invitations to friends via email to join a group.
 *
 * @param {Object} req - The request object with validation results and invitation details.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response data.
 * @throws {Object} If there are validation errors, the group is not found, or there is an issue sending emails.
 */
const inviteFriends = async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }
        const { emails, groupId } = req.body;
        const createdBy = req?.decoded?.userId;

        for (const email of emails) {
            const groupMember: any = await GroupModel.findOne({ _id: groupId, createdBy: createdBy });
            if (!groupMember)
                throw { status: 400, message: message.GROUP_CREATE_ERROR };
            await sendMail(email, groupMember.title, groupMember._id, groupMember.name);
        }

        sendSuccessResponse(res, message.OK, message.VERIFICATION_LINK, '');

    } catch (error: any) {
        sendErrorResponse(error, res, message);

    }
}

const addCountry = async () => {
    try {
        // Insert countries into the database using the insertMany method
        const data = await CountryModel.insertMany(countries);
        console.log('Countries inserted successfully:');
        // You can return the data or handle it as needed
        return data;
    } catch (error) {
        console.error('Error during country insertion:', error);
        // Handle the error or throw it further
        throw error;
    }
};

const addCategoryy = async () => {
    try {
        const data = await CategoryModel.insertMany(categories);
        console.log('Countries inserted successfully:',);
        return data;
    } catch (error) {
        console.error('Error during country insertion:', error);
        throw error;
    }
};
export { insertCountriesToDatabase, getCoutryList, searchCountry, inviteFriends, addCategoryy, addCountry };
