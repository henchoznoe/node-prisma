import { Request, Response } from "express";
import { PrismaClient, User } from '@prisma/client';
import { sendErrorResponse, sendSuccessResponse } from "../models/http-responses";

const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    const existingUser: User | null = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingUser) {
      return sendErrorResponse(res, 400, 'User with this email already exists. Please login');
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
    sendSuccessResponse(res, 201, data);
  } catch (error: any) {
    sendErrorResponse(res, 500, error.message || 'Error creating user');
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: User | null = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if ( !user || !(await validatePassword(password, user.password)) ) {
      return sendErrorResponse(res, 401, 'Invalid credentials');
    }
    const token = generateToken(user.id, user.email);
    const data = { id: user.id, mail: user.email, token };
    sendSuccessResponse(res, 200, data)
  } catch ( error: any ) {
    sendErrorResponse(res, 500, error.message || 'Error authenticating user')
  }
}

export const getAllUsers = async (_: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        lastName: true,
        firstName: true
      }
    });
    sendSuccessResponse(res, 200, users)
  } catch ( error: any ) {
    sendErrorResponse(res, 500, error.message || 'Error fetching users');
  }
}

const validatePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (id: number, mail: string) => {
  return jwt.sign({ id, mail }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};