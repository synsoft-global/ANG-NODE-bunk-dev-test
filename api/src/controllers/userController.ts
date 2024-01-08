import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth';
import message from '../message'
import { handleGlobalError } from '../utils/responder';
// import sendMail from '../helper/email';
// import { sendMessage } from '../helper/sendMessage';


/**
 * Create a new user.
 * Validates the request body, checks for an existing user with the same email, hashes the password,
 * and saves the new user to the database.
 * @param req Request object
 * @param res Response object
 */
const userRegister = async (req: Request, res: Response) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw { status: 400, message: message.VALIDATION_ERROR, errors: errors.array() };
        }

        const { userName, email, password, phone } = req.body;

        // Check if user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw { status: 400, message: message.USER_ALREADY_EXIST };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({ userName, email, password: hashedPassword, phone });
        await user.save();
        //send email 
        // if (req.body.phone) {
        //     await sendMessage('hello from server side trewilo test', req.body.phone)
        // } else {

        //     await sendMail()
        // }
        res.status(201).send({
            status: message.OK,
            message: message.USER_CREATED_SUCC,
            data: user,
        });
    } catch (error: any) {
        handleGlobalError(error, res, message);
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
        const user = await User.findOne({ email });
        if (!user) {
            throw { status: 400, message: message.EMAIL_NOT_REGISTER };
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw { status: 400, message: message.INVALID_PWD };
        }

        // Generate and send the JWT token
        const token = generateToken(user.id);
        res.status(200).send({
            status: message.OK,
            message: message.LOGIN_SUCC,
            data: user,
            token: token
        });
    } catch (error: any) {
        if (error?.status && error.message) {
            res.status(error.status).json({ status: message.Failed, error: error.message });
        } else {
            res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
        }
    }
};


export default { userRegister, userLogin };
