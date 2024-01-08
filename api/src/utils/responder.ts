import { Response } from "express";

const handleGlobalError = (error: any, res: Response, message: any) => {
    if (error?.status && error.message) {
        res.status(error.status).json({ status: message.Failed, error: error.message });
    } else {
        res.status(500).json({ status: message.Failed, error: message.INTERNAL_SERVER_ERROR });
    }
};


const sendSuccessResponse = (res: Response, OK: any, message: string, data?: any) => {
    const response = {
        status: OK,
        message: message,
        data: data
    };
    res.status(200).send(response);
};

export { handleGlobalError, sendSuccessResponse };
