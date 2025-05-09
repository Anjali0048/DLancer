import express from "express";
import { authenticate, createClientProfile, createFreelancerProfile } from "../controllers/UserController";
import { authTokenVerification } from "../middleware/authMiddleware";

const router =  express.Router();

router.post('/authenticate', authenticate);
router.post('/createFreelancerProfile', authTokenVerification, createFreelancerProfile);
router.post('/createClientProfile', authTokenVerification, createClientProfile);

export default router;