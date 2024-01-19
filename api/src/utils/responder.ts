import { Response } from "express";

const sendErrorResponse = (error: any, res: Response, message: any) => {
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

const sendPaginationResponse = (res: Response, OK: any, message: string, currentPage: number, totalPages: number, totalRecords: number, data?: any) => {
    const paginationResponse = {
        status: OK,
        message: message,
        pagination: {
            currentPage: currentPage,
            totalPages: totalPages,
            totalRecords: totalRecords,
        },
        data: data,
    };
    res.status(200).send(paginationResponse);
};

export { sendErrorResponse, sendSuccessResponse, sendPaginationResponse };
