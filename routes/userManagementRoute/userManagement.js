import express from "express";
import { UserManagementController } from "../../controllers/index.js";

const router = express.Router();

router.get("/listcustomer", UserManagementController.getCustomerList);
router.get("/customeraccount/:id", UserManagementController.getCustomerAccount);
router.get("/customerprofile/:id", UserManagementController.getCustomerProfile);
router.put("/customerprofile/:id", UserManagementController.putCustomerProfile);
router.put("/customeraccount/:id", UserManagementController.putCustomerAccount);
router.post("/createcustomer", UserManagementController.postCreateNewCustomer);
router.get("/liststaff", UserManagementController.getListStaff);
router.get("/liststaff/:id", UserManagementController.getListStaffByCustomerId);
router.get("/staffaccount/:id", UserManagementController.getStaffAccount);
router.get("/staffprofile/:id", UserManagementController.getStaffProfile);
router.put("/staffaccount/:id", UserManagementController.putStaffAccount);
router.put("/staffprofile/:id", UserManagementController.putStaffProfile);
router.post("/createstaff", UserManagementController.postCreateNewStaff);
router.put(
  "/removesub",
  UserManagementController.putRemoveCustomerFromStaffSubId
);
router.put("/addsub", UserManagementController.putAddCustomerToStaffSubId);
export default router;
