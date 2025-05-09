"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClientProfile = exports.createFreelancerProfile = exports.authenticate = void 0;
const Users_1 = __importDefault(require("../models/Users"));
const FreelancerSchema_1 = __importDefault(require("../models/FreelancerSchema"));
const ClientSchema_1 = __importDefault(require("../models/ClientSchema"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || " ";
// Route to authenticate a user
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, role } = req.body;
    if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required' });
    }
    try {
        let user = yield Users_1.default.findOne({ walletAddress });
        if (!user) {
            user = new Users_1.default({ walletAddress, role });
            yield user.save();
            const token = jsonwebtoken_1.default.sign({ walletAddress, role }, SECRET_KEY, {
                expiresIn: "120h",
            });
            // console.log("token: ", token)
            res.cookie("authtoken", token, {
                httpOnly: true,
                signed: true,
                maxAge: 5 * 24 * 60 * 60 * 1000,
            });
            return res.status(201).json({ message: 'User registered', user });
        }
        res.status(200).json({ message: 'User authenticated', user });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
exports.authenticate = authenticate;
const createFreelancerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, freelancerName, skills, portfolio, hourlyRate, availability } = req.body;
    try {
        // Fetch user
        const user = yield Users_1.default.findOne({ walletAddress });
        if (!user || user.role !== 'freelancer') {
            return res.status(400).json({ message: 'Invalid freelancer profile request' });
        }
        // Create freelancer profile
        const freelancerProfile = yield FreelancerSchema_1.default.create({
            walletAddress,
            freelancerName,
            skills,
            portfolio,
            hourlyRate,
            availability,
        });
        res.status(201).json({ message: 'Freelancer profile created successfully', profile: freelancerProfile });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.createFreelancerProfile = createFreelancerProfile;
const createClientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, clientName, companyName, projectsPosted, paymentHistory } = req.body;
    try {
        // Fetch user
        const user = yield Users_1.default.findOne({ walletAddress });
        if (!user || user.role !== 'client') {
            return res.status(400).json({ message: 'Invalid client profile request' });
        }
        // Create client profile
        const clientProfile = yield ClientSchema_1.default.create({
            walletAddress,
            clientName,
            companyName,
            projectsPosted,
            paymentHistory,
        });
        res.status(201).json({ message: 'Client profile created successfully', profile: clientProfile });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.createClientProfile = createClientProfile;
