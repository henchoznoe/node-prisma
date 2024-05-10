import { Response } from "express";

export const sendSuccessResponse = (res: Response, code: number, data: any) => {
  res.status(code).json({
    status: 'OK',
    data
  });
};

export const sendErrorResponse = (res: Response, code: number, message: string) => {
  res.status(code).json({
    status: 'KO',
    message
  });
};