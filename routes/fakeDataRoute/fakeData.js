import express from "express";
import { FakeController } from "../../controllers/index.js";
const router = express.Router();

router.post("/data", FakeController.generateFakeAccount);

export default router;
