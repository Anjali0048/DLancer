import express from "express"
import { acceptProposal, addFreelancerAddress, addGig, editGig, getGigsByWallet, getGigData, getProposals, getUserAuthGigs, submitProposal, getAllGigData, getProposalsByWalletAddress } from "../controllers/GigController";
import { authTokenVerification } from "../middleware/authMiddleware";

const router = express.Router()

router.get("/:gigId", getGigData);
router.get("/client/:walletAddress", getGigsByWallet);
router.get("/", getAllGigData);

// router.use(authTokenVerification)

router.post('/addGig', addGig)
router.put("/add-freelancer", addFreelancerAddress);
router.get("/user/:walletAddress", getUserAuthGigs);
router.put("/edit/:gigId", editGig);


// router.post("/:gigId/proposals", upload.single("file"), addProposal);
router.post("/:gigId/submitProposal",  submitProposal);
router.patch("/:gigId/proposals/:proposalId/accept", acceptProposal);
router.get("/:gigId/proposals", getProposals);
router.get("/proposals/:walletAddress", getProposalsByWalletAddress)


export default router;