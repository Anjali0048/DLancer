"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/authenticate', UserController_1.authenticate);
router.post('/createFreelancerProfile', authMiddleware_1.authTokenVerification, UserController_1.createFreelancerProfile);
router.post('/createClientProfile', authMiddleware_1.authTokenVerification, UserController_1.createClientProfile);
exports.default = router;
