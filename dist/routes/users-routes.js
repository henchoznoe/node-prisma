"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../ctrl/users");
const express_validator_1 = require("express-validator");
const fields_validation_1 = require("../models/fields-validation");
const router = express_1.default.Router();
router.get('/all', users_1.getAllUsers);
router.post('/signup', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Bad email format.'),
    (0, express_validator_1.check)('password').notEmpty().escape().withMessage('Bad password format.'),
    (0, express_validator_1.check)('firstName').escape().isLength({ min: 1, max: 32 }).withMessage('Bad firstName format.'),
    (0, express_validator_1.check)('lastName').escape().isLength({ min: 1, max: 32 }).withMessage('Bad lastName format.')
], fields_validation_1.handleValidationErrors, users_1.signup);
router.post('/login', [
    (0, express_validator_1.check)('email').isEmail().withMessage('Bad email format.'),
    (0, express_validator_1.check)('password').notEmpty().escape().withMessage('Bad password format.')
], fields_validation_1.handleValidationErrors, users_1.login);
exports.default = router;
