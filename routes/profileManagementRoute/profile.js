import express from "express";
import { ProfileController } from "../../controllers/index.js";
const router = express.Router();

router.get("/", ProfileController.getProfileData);
router.put("/editprofile", ProfileController.putEditProfile);

export default router;
