var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/Users';
import Freelancer from '../models/FreelancerSchema';
import Client from '../models/ClientSchema';
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY || " ";
// Route to authenticate a user
export const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, role } = req.body;
    if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet address is required' });
    }
    try {
        let user = yield User.findOne({ walletAddress });
        if (!user) {
            user = new User({ walletAddress, role });
            yield user.save();
            const token = jwt.sign({ walletAddress, role }, SECRET_KEY, {
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
export const createFreelancerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, freelancerName, skills, portfolio, hourlyRate, availability } = req.body;
    try {
        // Fetch user
        const user = yield User.findOne({ walletAddress });
        if (!user || user.role !== 'freelancer') {
            return res.status(400).json({ message: 'Invalid freelancer profile request' });
        }
        // Create freelancer profile
        const freelancerProfile = yield Freelancer.create({
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
export const createClientProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress, clientName, companyName, projectsPosted, paymentHistory } = req.body;
    try {
        // Fetch user
        const user = yield User.findOne({ walletAddress });
        if (!user || user.role !== 'client') {
            return res.status(400).json({ message: 'Invalid client profile request' });
        }
        // Create client profile
        const clientProfile = yield Client.create({
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
