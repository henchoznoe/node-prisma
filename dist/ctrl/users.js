"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.login = exports.signup = void 0;
const client_1 = require("@prisma/client");
const http_responses_1 = require("../models/http-responses");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const prisma = new client_1.PrismaClient();
const signup = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return (0, http_responses_1.sendErrorResponse)(res, 400, 'User with this email already exists. Please login');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName
            }
        });
        const token = generateToken(newUser.id, newUser.email);
        const data = { id: newUser.id, email: newUser.email, token };
        (0, http_responses_1.sendSuccessResponse)(res, 201, data);
    }
    catch (error) {
        (0, http_responses_1.sendErrorResponse)(res, 500, error.message || 'Error creating user');
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user || !(await validatePassword(password, user.password))) {
            return (0, http_responses_1.sendErrorResponse)(res, 401, 'Invalid credentials');
        }
        const token = generateToken(user.id, user.email);
        const data = { id: user.id, mail: user.email, token };
        (0, http_responses_1.sendSuccessResponse)(res, 200, data);
    }
    catch (error) {
        (0, http_responses_1.sendErrorResponse)(res, 500, error.message || 'Error authenticating user');
    }
};
exports.login = login;
const getAllUsers = async (_, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                lastName: true,
                firstName: true
            }
        });
        (0, http_responses_1.sendSuccessResponse)(res, 200, users);
    }
    catch (error) {
        (0, http_responses_1.sendErrorResponse)(res, 500, error.message || 'Error fetching users');
    }
};
exports.getAllUsers = getAllUsers;
const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
const generateToken = (id, mail) => {
    return jwt.sign({ id, mail }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};
