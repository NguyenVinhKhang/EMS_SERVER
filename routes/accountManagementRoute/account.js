import express from "express";
import { AccountController } from "../../controllers/index.js";
const router = express.Router();

router.post("/session", AccountController.checkSession);
router.post("/login", AccountController.login);
router.post("/logout", AccountController.logout);
router.post("/register", AccountController.register);
router.put("/changepassword", AccountController.putChangeAccountPassword);
router.put("/changephonenumber", AccountController.putChangeAccountPhoneNumber);

export default router;
