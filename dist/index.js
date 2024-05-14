"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_responses_1 = require("./models/http-responses");
const users_routes_1 = __importDefault(require("./routes/users-routes"));
require('dotenv').config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});
app.use('/api/users', users_routes_1.default);
app.use((_, res) => {
    (0, http_responses_1.sendErrorResponse)(res, 404, 'This route doesn\'t exist...');
});
app.use((err, req, res, next) => {
    (0, http_responses_1.sendErrorResponse)(res, err.code || 500, err.message || 'An unknown error occurred...');
});
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running : http://localhost:${process.env.SERVER_PORT}/`);
});
//# sourceMappingURL=index.js.map