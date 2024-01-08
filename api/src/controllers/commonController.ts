import { Request, Response } from 'express';
import countries from '../data/countries';
import CountryModel from '../models/country';
import message from '../message'
import User from '../models/user';
import groupModel from '../models/groupMember';
import sendMail from '../helper/email';
import { validationResult } from 'express-validator';


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

        // Respond with success message and the inserted data
        res.status(200).send({
            status: message.OK,
            message: message.Success,
            data: data,
        });
    } catch (error) {
        // Handle errors and respond with a generic internal server error message
        res.status(500).json({ status: message.Failed, error: error });
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
        const findData = await CountryModel.find();

        // Respond with success message and the fetched country data
        res.status(200).send({
            status: message.OK,
            message: message.Success,
            data: findData,
        });
    } catch (error) {
        // Handle errors and respond with a generic internal server error message
        res.status(500).json({ status: message.Failed, error: error });
    }
}

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

        // Respond with success message and the fetched country data
        res.status(200).send({
            status: message.OK,
            message: message.Success,
            data: findData,
        });
    } catch (error: any) {
        // Handle errors and respond with a generic internal server error message
        res.status(500).json({ status: message.Failed, error: error.message });
    }
};

// const inviteFriends = async (req: any, res: any) => {
//     try {
//         const { email, groupId } = req.body;
//         const createdBy = req?.decoded?.userId

//         const user = await User.findOne({ email });
//         if (!user) {
//             throw { status: 400, message: message.EMAIL_NOT_REGISTER };
//         }

//         const groupMember = new groupModel({ groupId, users: user._id, createdBy: createdBy });
//         await groupMember.save();
//         await sendMail(email)
//         // Respond with success message and the fetched country data
//         res.status(200).send({
//             status: message.OK,
//             message: message.VERIFICATION_LINK,
//             data: groupMember,
//         });
//     } catch (error: any) {
//         if (error?.status && error.message) {
//             res.status(error.status).json({ status: message.Failed, error: error.message });
//         } else {
//             res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
//         }
//     }
// };

const inviteFriends = async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Validation error
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }
        const { emails, groupId } = req.body;
        const createdBy = req?.decoded?.userId;

        const invitedMembers = [];

        for (const email of emails) {
            const user = await User.findOne({ email });

            if (!user) {
                // Skip invalid emails, or you may choose to handle them differently
                throw { status: 400, message: `User with email ${email} not found.` };
            }

            const groupMember = new groupModel({ groupId, users: user._id, createdBy: createdBy });
            await groupMember.save();
            invitedMembers.push(groupMember);
            await sendMail(email);
        }

        // Respond with success message and the fetched country data
        res.status(200).json({
            status: message.OK,
            message: message.VERIFICATION_LINK,
            data: invitedMembers,
        });
    } catch (error: any) {
        if (error?.status && error.message) {
            // Respond with specific error message and status code
            res.status(error.status).json({ status: message.Failed, error: error.message });
        } else {
            // Respond with a generic internal server error message
            res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
        }
    }
};






export { insertCountriesToDatabase, getCoutryList, searchCountry, inviteFriends };
