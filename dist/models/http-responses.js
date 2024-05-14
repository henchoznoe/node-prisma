"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendErrorResponse = exports.sendSuccessResponse = void 0;
const sendSuccessResponse = (res, code, data) => {
    res.status(code).json({
        status: 'OK',
        data
    });
};
exports.sendSuccessResponse = sendSuccessResponse;
const sendErrorResponse = (res, code, message) => {
    res.status(code).json({
        status: 'KO',
        message
    });
};
exports.sendErrorResponse = sendErrorResponse;
//# sourceMappingURL=http-responses.js.map