"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const GigController_1 = require("../controllers/GigController");
const router = express_1.default.Router();
router.get("/:gigId", GigController_1.getGigData);
router.get("/client/:walletAddress", GigController_1.getGigsByWallet);
router.get("/", GigController_1.getAllGigData);
// router.use(authTokenVerification)
router.post('/addGig', GigController_1.addGig);
router.put("/add-freelancer", GigController_1.addFreelancerAddress);
router.get("/user/:walletAddress", GigController_1.getUserAuthGigs);
router.put("/edit/:gigId", GigController_1.editGig);
// router.post("/:gigId/proposals", upload.single("file"), addProposal);
router.post("/:gigId/submitProposal", GigController_1.submitProposal);
router.patch("/:gigId/proposals/:proposalId/accept", GigController_1.acceptProposal);
router.get("/:gigId/proposals", GigController_1.getProposals);
router.get("/proposals/:walletAddress", GigController_1.getProposalsByWalletAddress);
exports.default = router;
