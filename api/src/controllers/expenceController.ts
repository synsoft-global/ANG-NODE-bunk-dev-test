import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import message from '../message'
import expenseModel from '../models/expense';
import { sendErrorResponse, sendPaginationResponse, sendSuccessResponse } from '../utils/responder';
import mongoose from 'mongoose';
import paymentDistribution from '../models/paymentDistribution';
import GroupModel from '../models/group';



/**
 * Create a new category.
 * Validates the request body, checks for existing categories, and saves the new category.
 * @param req Request object
 * @param res Response object
 */
const createExpenseWithDistributions = async (req: Request, res: Response) => {
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

        // Use Promise.all to await all promises in the array before proceeding
        await Promise.all(users.map(async (item: any) => {
            const createDistribution = new paymentDistribution({
                expenseId: expense._id,
                groupId: groupId,
                amount: (amount / users.length),
                userId: item.id,
            });
            await createDistribution.save();
        }));

        sendSuccessResponse(res, message.OK, message.EXPENSE_CREATED_SUCC, expense);

    } catch (error: any) {
        sendErrorResponse(error, res, message);
    }
};

/**
 * Get all categories.
 * Fetches all categories from the database and sends them in the response.
 * @param _req Request object
 * @param res Response object
 */
const getExpence = async (req: any, res: Response) => {
    try {
        const page = parseInt(req.query['page'] as string, 10) || 1;
        const pageSize = parseInt(req.query['limit'] as string, 10) || 10; // Current page (default to 1 if not provided)
        const skip = (page - 1) * pageSize;

        // Retrieve expenses with pagination and sorting by createdAt: -1
        const findExpence = await expenseModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize);

        const totalRecords = await expenseModel.countDocuments();

        const totalPages = Math.ceil(totalRecords / pageSize);
        sendPaginationResponse(res, message.OK, message.Success, page, totalPages, totalRecords, findExpence);

    } catch (error) {
        sendErrorResponse(error, res, message);
    }
};

const getExpenceById = async (req: any, res: Response) => {
    try {
        // Retrieve all categories from the database
        const id = req.params.id;
        // const findExpence = await expenseModel.findById(id);

        const data = await expenseModel.findById(id)
        sendSuccessResponse(res, message.OK, message.Success, data)
    } catch (error) {
        sendErrorResponse(error, res, message);

    }
};


/**
 * Retrieve expenses by group ID.
 *
 * Retrieves expenses associated with the provided group ID.
 *
 * @param {Object} req - The request object containing the group ID in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response data.
 * @throws {Error} If there's an error during the retrieval process.
 */
const getExpenseByGroupId = async (req: any, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const groupId = new mongoose.Types.ObjectId(req.params.id);
        const page = parseInt(req.query['page'] as string) || 1;
        const pageSize = parseInt(req.query['limit'] as string, 10) || 10;
        const skip = (page - 1) * pageSize;

        const getExpenses = await expenseModel
            .find({ groupId })
            .skip(skip)
            .limit(pageSize);

        if (getExpenses.length === 0) {
            const data1: any = await getGroupData(groupId);
            const data = [{
                groupInfo: {
                    title: data1.title,
                    description: data1.description,
                    createdBy: data1.createdBy.userName,
                    participants: data1.participants,
                }
            }];

            sendSuccessResponse(res, message.OK, message.Success, data);
        } else {

            const data = await getAggregateData(groupId, page, pageSize);
            res.status(200).send({
                status: message.OK,
                message: message.Success,
                pagination: data.pagination,
                data: data.data,
            });
        }
    } catch (error) {
        console.error("Error", error);
        sendErrorResponse(error, res, message);
    }
};

const getGroupData = async (groupId: mongoose.Types.ObjectId) => {
    return GroupModel.findById(groupId)
        .populate('createdBy', 'userName email')
        .exec();
};

const getAggregateData = async (groupId: mongoose.Types.ObjectId, page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize;

    const data = await expenseModel.aggregate([
        {
            $match: {
                groupId
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "paidBy",
                foreignField: "_id",
                as: "paidByUser"
            }
        },
        {
            $lookup: {
                from: "groups",
                localField: "groupId",
                foreignField: "_id",
                as: "groupInfo"
            }
        },
        {
            $unwind: "$groupInfo"
        },
        {
            $project: {
                title: 1,
                amount: 1,
                paidBy: 1,
                "paidByUser.userName": 1,
                "groupInfo.title": 1,
                "groupInfo.participants": 1
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: pageSize
        }
    ]);

    const totalRecords = await expenseModel.countDocuments({ groupId });
    const totalPages = Math.ceil(totalRecords / pageSize);

    const processedData = await Promise.all(data.map(async (item: any) => {
        const paidByUser = item.paidByUser && item.paidByUser.length > 0
            ? item.paidByUser[0].userName
            : (item.paidBy
                ? item.groupInfo.participants
                    .filter((value: any) => !value.isGroupJoin)
                    .find((value: any) => item.paidBy.equals(value.id))?.name
                : undefined);

        return {
            expenseData: {
                _id: item._id,
                title: item.title,
                amount: item.amount,
                paidBy: item.paidBy,
                paidByUser,
            },
            groupInfo: item.groupInfo,
        };
    }));

    return {
        data: processedData,
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalRecords,
        },
    };
};


/**
 * Update an existing expense.
 * Validates the request body and updates the expense with the provided ID.
 * @param req Request object with the expense ID in params and updated data in body
 * @param res Response object
 */
const updateExpense = async (req: any, res: Response) => {
    try {

        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { title, amount, users, paidBy, groupId, image, paidAt } = req.body;
        const expenseId = req.params.id; // Assuming the expense ID is in the route params

        const findGroup = await GroupModel.findById(groupId);
        if (!findGroup) {
            throw { status: 400, message: message.NO_GROUP_FOUND };
        }
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

        // Use Promise.all to wait for all updates before sending the response
        await Promise.all(users.map(async (item: any) => {
            await paymentDistribution.findOneAndUpdate(
                { expenseId: expenseId, userId: item.id },
                { amount: amount / users.length },
                { new: true }
            );
        }));

        // Fetch paymentDistribution documents for the specified expense ID

        res.status(200).send({
            status: message.OK,
            message: message.EXPENSE_UPDATED_SUCC,
            data: {
                updatedExpense,
                // expensePaymentDistributions,
            },
        });
    } catch (error: any) {
        sendErrorResponse(error, res, message);

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
        await paymentDistribution.deleteMany({ expenseId: expenseId });

        if (!deletedExpense) {
            throw { status: 404, message: message.NO_DATA_FOUND };
        }

        res.status(200).send({
            status: message.OK,
            message: message.EXPENSE_DELETED_SUCC,
            data: deletedExpense,
        });
    } catch (error: any) {
        sendErrorResponse(error, res, message);

    }
};

const getTotalExpensesByGroupId = async (req: any, res: Response) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }
        const groupId = new mongoose.Types.ObjectId(req.params.id);
        // Calculate total amount for each user from expenseModel
        const result = await expenseModel.aggregate([
            {
                $match: {
                    groupId: groupId,
                },
            },
            {
                $unwind: "$users",
            },
            {
                $group: {
                    _id: "$users.id",
                    userName: { $first: "$users.name" },
                    isGroupJoin: { $first: "$users.isGroupJoin" },
                    totalAmount: { $sum: "$amount" },
                    paidBy: { $first: "$paidBy" }, // Include the paidBy field

                },
            },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" },
                    userAmounts: { $push: { id: "$_id", userName: "$userName", isGroupJoin: "$isGroupJoin", totalAmount: "$totalAmount", paidBy: "$paidBy" } },
                },
            },
        ]);

        // Extract the totalAmount and userAmounts from the result
        const totalAmount = result.length > 0 ? result[0].totalAmount : 0;
        const userAmounts = result.length > 0 ? result[0].userAmounts : [];

        // Calculate and include the sum of amounts for each user from paymentDistribution
        for (const user of userAmounts) {
            const userId = user.id;

            const userSumResult = await paymentDistribution.aggregate([
                {
                    $match: {
                        groupId: groupId,
                        userId: new mongoose.Types.ObjectId(userId),
                    },
                },
                {
                    $group: {
                        _id: "$userId",
                        totalAmount: { $sum: "$amount" },
                    },
                },
            ]);

            user.totalAmount = userSumResult.length > 0 ? userSumResult[0].totalAmount : 0;
        }

        // Respond with the total amount and user-specific amounts
        res.send({
            totalAmount,
            userAmounts,
        });
    } catch (error: any) {
        console.error(error);
        sendErrorResponse(error, res, message);
    }
};



/**
 * Calculate final expenses for a group.
 *
 * Calculates the final expenses for a group, including total amount,
 * amount paid by the user, and details for users with no payments.
 *
 * @param {Object} req - The request object containing the group ID in params.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response data.
 * @throws {Error} If there's an error during the calculation process.
 */
const finalExpence = async (req: any, res: any) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }
        const groupId = new mongoose.Types.ObjectId(req.params.id);
        const groupData: any = await GroupModel.findById(groupId).populate('currencyId').exec()

        if (!groupData || !groupData.participants || groupData.participants.length === 0) {
            return res.send({ totalAmount: 0, paidByMe: 0, usersWithNoPayments: [] });
        }

        const participantIds = groupData.participants.map((participant: any) => participant.id);

        const aggregationPipeline = [
            {
                $match: {
                    groupId: groupId,
                    userId: { $in: participantIds.map((id: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array | undefined) => new mongoose.Types.ObjectId(id)) }
                }
            },
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        groupId: "$groupId"
                    },
                    totalAmount: { $sum: "$amount" },
                }
            }
        ];
        const exData1 = await paymentDistribution.aggregate(aggregationPipeline).exec();
        const totalPaidByMeAmount = exData1.reduce((sum, user) => sum + user.totalAmount, 0);

        const userDataPromises = groupData.participants.map(async (participant: any) => {
            const expenseAggregationPipeline = [
                {
                    $match: {
                        groupId: groupId,
                        paidBy: new mongoose.Types.ObjectId(participant.id)
                    }
                },
                {
                    $group: {
                        _id: "$paidBy",
                        paidByMeAmount: { $sum: "$amount" },
                    }
                }
            ];

            const paidUsers = await expenseModel.aggregate(expenseAggregationPipeline).exec();
            const mePaidTotal = paidUsers.length > 0 ? paidUsers[0].paidByMeAmount : 0;

            const countryAmount = exData1.find(ex => ex._id.userId.equals(participant.id));
            const myTotal = countryAmount ? countryAmount.totalAmount : 0;

            return {
                id: participant.id,
                name: participant.name,
                isGroupJoin: participant.isGroupJoin,
                mePaidTotal: mePaidTotal,
                countyName: groupData?.currencyId?.name ? groupData?.currencyId?.name : '',
                currency: groupData?.currencyId?.currency ? groupData?.currencyId?.currency : '',
                myTotal: myTotal,
                groupId: groupId,
                GroupTotal: totalPaidByMeAmount,
                needToPay: mePaidTotal - myTotal,
            };
        });

        const userData = await Promise.all(userDataPromises);
        sendSuccessResponse(res, message.OK, '', userData);

    } catch (error) {
        sendErrorResponse(error, res, message);
    }
};




export { createExpenseWithDistributions, getExpence, updateExpense, deleteExpense, getExpenseByGroupId, getExpenceById, getTotalExpensesByGroupId, finalExpence };
