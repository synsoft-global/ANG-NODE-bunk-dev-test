import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';
import message from '../message'
import { sendErrorResponse, sendSuccessResponse } from '../utils/responder';
import { findByEmail } from '../services/userService';


/**
 * Create a new user.
 * Validates the request body, checks for an existing user with the same email, hashes the password,
 * and saves the new user to the database.
 * @param req Request object
 * @param res Response object
 */
const registerUser = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { userName, email, password, phone } = req.body;
        // Check if user with the same email already exists
        const existingUser1 = await findByEmail(email)
        if (existingUser1) {
            throw { status: 400, message: message.USER_ALREADY_EXIST };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({ userName, email, password: hashedPassword, phone });
        await user.save();
        sendSuccessResponse(res, message.OK, message.USER_CREATED_SUCC, user);

    } catch (error: any) {
        sendErrorResponse(error, res, message);
    }
};

/**
 * Login a user.
 * Validates the request body, checks if the user exists, verifies the password,
 * generates and sends a JWT token for successful login.
 * @param req Request object
 * @param res Response object
 */
const userLogin = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { email, password } = req.body;

        // Check if the user exists
        const user = await findByEmail(email);
        if (!user) {
            throw { status: 400, message: message.EMAIL_NOT_REGISTER };
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw { status: 400, message: message.INVALID_PWD };
        }

        // Generate and send the JWT token
        const token = generateToken(user.id, user.userName, user.email);
        res.status(200).send({
            status: message.OK,
            message: message.LOGIN_SUCC,
            data: user,
            token: token
        });
    } catch (error: any) {
        sendErrorResponse(error, res, message);
    }
};



export default { registerUser, userLogin };
