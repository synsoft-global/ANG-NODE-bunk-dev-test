import jwt from 'jsonwebtoken';
import message from '../message';
import { findUserById } from '../services/userService';

const generateToken = (userId: string, userName: string, email: string) => {
    return jwt.sign({ userId, userName, email }, process.env.JWT_SECRET_KEY, { expiresIn: '90d' });
};

const verifyToken = async (req: any, res: any, next: any) => {
    try {
        let token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
        if (!token) {
            return res.status(403).send({ status: message.Failed, message: "A token is required for authentication", data: '' });
        }
        token = token.replace("Bearer ", "")
        const temp = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.decoded = temp;
        const findData = await findUserById(req.decoded.userId)
        if (findData) {
            next();
        }
        else {
            throw { status: 401, message: message.UNAUTHORIZED };
        }

    } catch (err: any) {
        if (err.status === 401) {
            return res.status(401).send({ status: message.Failed, message: err.message, data: '' });
        } else {
            return res.status(400).send({ stausCode: 0, message: err.toString() });
        }
    }
};

export { generateToken, verifyToken };
