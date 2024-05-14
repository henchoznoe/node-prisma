import express from 'express';

import { getAllUsers, signup, login } from '../ctrl/users';
import { check } from "express-validator";
import { handleValidationErrors } from "../models/fields-validation";

const router = express.Router();

router.get(
  '/all',
  getAllUsers
);

router.post(
  '/signup',
  [
    check('email').isEmail().withMessage('Bad email format.'),
    check('password').notEmpty().escape().withMessage('Bad password format.'),
    check('firstName').escape().isLength({min: 1, max: 32}).withMessage('Bad firstName format.'),
    check('lastName').escape().isLength({min: 1, max: 32}).withMessage('Bad lastName format.')
  ],
  handleValidationErrors,
  signup
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Bad email format.'),
    check('password').notEmpty().escape().withMessage('Bad password format.')
  ],
  handleValidationErrors,
  login
);

export default router;