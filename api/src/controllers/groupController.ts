import { Request, Response } from 'express';
import GroupModel from '../models/group';
import message from '../message'
import groupModel from '../models/groupMember';

/**
 * Create a new payment record.
 * Validates the request body and saves the payment record to the database.
 * @param req Request object
 * @param res Response object
 */
const createGroup = async (req: any, res: Response) => {
    try {
        const { title, description, currencyId, categoryId, participants } = req.body;

        // Create a new GroupModel instance
        const newGroup = new GroupModel({
            title,
            description,
            currencyId,
            categoryId,
            participants,
            createdBy: req?.decoded?.userId
        });

        // Save the new payment record
        const savedPayment = await newGroup.save();

        // Respond with success message and the saved payment data
        res.status(201).send({ status: message.OK, message: message.CREATE_GROUP_SUCC, data: savedPayment });
    } catch (error) {
        // Log the error and respond with a generic internal server error message
        res.status(500).json({ status: message.Failed, error: error });
    }
};

/**
 * List payment records with pagination.
 * Fetches payment records from the database with pagination and sends them in the response.
 * @param req Request object
 * @param res Response object
 */
const getGroup = async (req: any, res: Response) => {
    try {
        // Get page and limit from query parameters or use default values
        const page = parseInt(req.query['page'] as string, 10) || 1;
        const limit = parseInt(req.query['limit'] as string, 10) || 10;
        console.log("Reqqqqqqqqqqqqqqqq", req.decoded.userId)
        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Use Mongoose find method with skip and limit for pagination
        const findData = await GroupModel.find().skip(skip).limit(limit);

        // Get the total count of documents in the collection
        const totalCount = await GroupModel.countDocuments();
        // Respond with success message, pagination details, and the fetched payment records
        res.status(200).send({
            status: message.OK,
            message: message.Success,
            totalRecords: totalCount,
            currentPage: page,
            recordsOnPage: findData.length,
            data: findData,
        });

    } catch (error) {
        // Respond with a generic internal server error message in case of an error
        res.status(500).send({ status: message.Failed, error: error });
    }
}

const getGroupMembers = async (req: any, res: Response) => {
    try {
        const { id } = req.params
        const data = await groupModel.find({ users: id })
            .populate({
                path: 'groupId',
                select: 'title currencyId categoryId participants',
            }).select('users createdBy groupId'); // Select fields from groupModel

        res.status(200).send({
            status: message.OK,
            message: message.Success,
            data: data

        });

    } catch (error) {
        res.status(500).send({ status: message.Failed, error: error });
    }
}


export { createGroup, getGroup, getGroupMembers };
