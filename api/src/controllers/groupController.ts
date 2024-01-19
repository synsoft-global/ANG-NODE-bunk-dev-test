import { Response } from 'express';
import GroupModel from '../models/group';
import message from '../message'
import groupMember from '../models/groupMember';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responder';
import { validationResult } from 'express-validator';
import tempModel from '../models/temp';
import mongoose from 'mongoose';

/**
 * Create a new payment record.
 * Validates the request body and saves the payment record to the database.
 * @param req Request object
 * @param res Response object
 */
const createGroupWithParticipants = async (req: any, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { title, description, currencyId, categoryId, participants } = req.body;

        for (let i = participants.length - 1; i >= 0; i--) {
            if (participants[i] === "") {
                participants.splice(i, 1);
            }
        }
        // Create a new GroupModel instance
        const newGroup = new GroupModel({
            title,
            description,
            currencyId,
            categoryId,
            createdBy: req?.decoded?.userId,
            participants: [{ name: req.decoded.userName, id: new mongoose.Types.ObjectId(req?.decoded?.userId), isGroupJoin: true }]
        });

        // Save the new group record
        const savedGroup = await newGroup.save();
        // Create groupMember record
        const addMember = new groupMember({
            users: savedGroup.createdBy,
            createdBy: savedGroup.createdBy,
            groupId: savedGroup._id,
        });

        await addMember.save();

        // Create tempModel records for each participant
        const tempDataPromises = participants.map(async (participantUserName: string) => {
            const tempRecord = new tempModel({
                userName: participantUserName,
                groupId: savedGroup._id,
            });
            return tempRecord.save();
        });

        // Wait for all tempData records to be created
        const tempDataRecords = await Promise.all(tempDataPromises);

        // Map tempDataRecords to an array of objects with 'name' and 'id'
        const tempDataArray = tempDataRecords.map((record) => ({ name: record.userName, id: record._id, isGroupJoin: false }));

        // Update the GroupModel with the tempDataArray
        const updatedGroupData = await GroupModel.findOneAndUpdate(
            { _id: savedGroup._id },
            { $push: { participants: { $each: tempDataArray } } },
            { new: true }
        );

        // Respond with success message and the saved group data
        sendSuccessResponse(res, message.OK, message.CREATE_GROUP_SUCC, updatedGroupData);
    } catch (error) {
        // Log the error and respond with a generic internal server error message
        sendErrorResponse(error, res, message);
    }
};

/**
 * Join a user to a group.
 * Validates the request body, checks if the group and temporary user exist,
 * verifies if the user is not already a member, and then adds the user to the group.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
const joinGroup = async (req: any, res: Response) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { userId, userName } = req.body;
        const groupId = req.params.id;

        // Combine group and temp user checks
        const [findGroup, checkTempUser] = await Promise.all([
            GroupModel.findById(groupId),
            tempModel.findOne({ userName: userName, groupId: groupId }),
        ]);

        if (!findGroup) {
            throw { status: 400, message: message.NO_GROUP_FOUND };
        }
        if (!checkTempUser) {
            throw { status: 400, message: message.NO_ACCOUNT_FOUND_TEMP_USER };
        }

        const session = await mongoose.startSession(); // Start a transaction

        try {

            await groupMember.create({ users: userId, groupId }, { session });

            // Find the index of the participant with the given name
            const participantIndex = findGroup.participants.findIndex(
                (participant) => participant.name === userName
            );

            if (participantIndex !== -1) {
                // If the participant with the given name is found, update the document
                await GroupModel.updateOne(
                    { _id: groupId, "participants.name": userName },
                    { $set: { "participants.$.id": userId, "participants.$.isGroupJoin": true } },
                    { session }
                );
            } else {
                throw { status: 404, message: 'Participant not found' };
            }

            await tempModel.findByIdAndDelete(checkTempUser._id, { session });
        } finally {
            session.endSession(); // End the transaction
        }

        sendSuccessResponse(res, message.OK, message.JOIN_GROUP_SUCC);
    } catch (error) {
        sendErrorResponse(error, res, message);
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
            pagination: {
                totalRecords: totalCount,
                currentPage: page,
                recordsOnPage: findData.length,
            },
            data: findData,
        });

    } catch (error) {
        // Respond with a generic internal server error message in case of an error
        sendErrorResponse(error, res, message);
    }
}


const getLoggedInUserGroup = async (req: any, res: Response) => {
    try {
        const userId = req.decoded.userId;
        const page = req.query.page || 1; // Current page (default to 1 if not provided)
        const pageSize = req.query.limit || 10; // Number of items per page

        // Retrieve total records without pagination
        const totalRecords = await groupMember.countDocuments({
            $or: [
                { users: userId },
                { createdBy: userId }
            ]
        });

        // Retrieve paginated data
        const findData = await groupMember
            .find({
                $or: [
                    { users: userId },
                    { createdBy: userId }
                ]
            })
            .populate({
                path: 'groupId',
                select: 'title currencyId categoryId participants description',
            })
            .select('users createdBy groupId')
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Calculate total pages
        const totalPages = Math.ceil(totalRecords / pageSize);

        // Include pagination information in the response
        sendSuccessResponse(res, message.OK, message.Success, {
            data: findData,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalRecords: totalRecords,
            },
        });

    } catch (error) {
        console.log("error", error)
        // Respond with a generic internal server error message in case of an error
        sendErrorResponse(error, res, message);
    }
}

/**
 * Get group members by group ID.
 *
 * @param {Object} req - The request object with the group ID in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with group member data.
 * @throws {Object} If there is an error during the retrieval process.
 */
const groupMemberBygroupId = async (req: any, res: Response) => {
    try {


        const groupId = req.params.id
        let data = await groupMember.findOne({ groupId: groupId })
            .populate({
                path: 'groupId',
            })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .exec();
        sendSuccessResponse(res, message.OK, message.Success, data);

    } catch (error) {
        console.log("error", error)
        // Respond with a generic internal server error message in case of an error
        sendErrorResponse(error, res, message);
    }
}


const getDataByGroupId = async (req: any, res: Response) => {
    try {
        const groupId = req.params.id
        const findData = await GroupModel.findById(groupId)
        sendSuccessResponse(res, message.OK, message.Success, findData);

    } catch (error) {
        console.log("error", error)
        sendErrorResponse(error, res, message);
    }
}

const getGroupMembers = async (req: any, res: Response) => {
    try {
        const { id } = req.params
        const data = await groupMember.find({ users: id })
            .populate({
                path: 'groupId',
                select: 'title currencyId categoryId participants',
            }).select('users createdBy groupId'); // Select fields from groupMember

        sendSuccessResponse(res, message.OK, message.Success, data);

    } catch (error) {
        sendErrorResponse(error, res, message);
    }
}


/**
 * Update a group's information.
 *
 * @param {Object} req - The request object with the group ID in params and updated group information in the body.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves after updating the group information.
 * @throws {Object} If there is an error during the update process or if input validation fails.
 */
const updateGroup = async (req: any, res: Response) => {
    try {

        // Validate input before processing
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const groupId = req.params.id;
        const { title, description, currencyId, categoryId, participants } = req.body;

        const findGroup = await GroupModel.findById(groupId);
        if (!findGroup) {
            throw { status: 400, message: message.NO_GROUP_FOUND };
        }
        // Efficiently create temp records for new participants
        const newParticipants = participants.filter((item: any) => item.id === undefined);
        const tempRecords = await Promise.all(
            newParticipants.map((item: any) => tempModel.create({ userName: item.name, groupId }))
        );

        // Update participant IDs directly
        const updatedParticipants = participants.map((participant: any) => ({
            ...participant,
            id: participant.id || tempRecords.find((temp) => temp.userName === participant.name)._id,
            isGroupJoin: participant.isGroupJoin ? true : false
        }));


        // Update the group with minimal operations
        await GroupModel.updateOne(
            { _id: groupId },
            {
                $set: {
                    participants: updatedParticipants,
                    title,
                    description,
                    currencyId,
                    categoryId,
                },
            }
        );
        const data = await GroupModel.findById(groupId);
        // Send a success response
        sendSuccessResponse(res, message.OK, message.Success, data);
    } catch (error) {
        console.error("error", error);
        sendErrorResponse(error, res, message);
    }
};


/**
 * Delete a group and associated data.
 *
 * @param {Object} req - The request object with the group ID in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves after deleting the group and associated data.
 * @throws {Object} If there is an error during the deletion process.
 */
const deleteGroup = async (req: any, res: Response) => {
    try {
        const groupId = req.params.id;

        await GroupModel.deleteOne({ _id: groupId });

        await groupMember.deleteMany({ groupId: groupId });

        // Uncomment the following line if you want to delete tempModel records
        await tempModel.deleteMany({ groupId: groupId });

        // Respond with success message
        sendSuccessResponse(res, message.OK, message.Success);
    } catch (error) {
        // Log the error and respond with a generic internal server error message
        console.error("error", error);
        sendErrorResponse(error, res, message);
    }
};


export { createGroupWithParticipants, getGroup, getGroupMembers, getLoggedInUserGroup, joinGroup, groupMemberBygroupId, getDataByGroupId, updateGroup, deleteGroup };
