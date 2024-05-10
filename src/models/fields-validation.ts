import { validationResult } from "express-validator";
import { sendErrorResponse } from "./http-responses";
import { Request, Response, NextFunction } from "express";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if ( !errors.isEmpty() ) {
    sendErrorResponse(res, 400, errors.array().map(error => error.msg).join(' '));
    return;
  }
  next();
};