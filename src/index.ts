import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import { sendErrorResponse } from "./models/http-responses";

import usersRoutes from './routes/users-routes';

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.use((_: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);

app.use((_: Request, res: Response) => {
  sendErrorResponse(res, 404, 'This route doesn\'t exist...');
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  sendErrorResponse(res, err.code || 500, err.message || 'An unknown error occurred...')
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running : http://localhost:${process.env.SERVER_PORT}/`);
});