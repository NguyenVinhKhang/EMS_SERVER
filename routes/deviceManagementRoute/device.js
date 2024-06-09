import express from "express";
import { DeviceManagementController } from "../../controllers/index.js";

const router = express.Router();

router.post("/createdevice", DeviceManagementController.postCreateNewDevice);
router.get("/listalldevice", DeviceManagementController.getListAllDevice);
router.get(
  "/managedevices",
  DeviceManagementController.getListDeviceManageById
);
router.get(
  "/followingdevices",
  DeviceManagementController.getListDeviceFollowingById
);
router.get("/devicedetail/:serial", DeviceManagementController.getDeviceDetail);
router.get(
  "/devicefollowers/:serial",
  DeviceManagementController.getListDeviceFollower
);
router.get("/owndevices", DeviceManagementController.getOwnListDevice);
router.put(
  "/editdevicedetail/:serial",
  DeviceManagementController.putEditDeviceDetail
);
router.put(
  "/changedeviceowner/:serial",
  DeviceManagementController.putChangeDeviceOwner
);
router.put(
  "/editdevicepath/:serial",
  DeviceManagementController.putEditDevicePath
);
router.put(
  "/changedevicemanager/:serial",
  DeviceManagementController.putChangeDeviceManager
);
router.put(
  "/adddevicefollower/:serial",
  DeviceManagementController.putAddCustomerToDeviceFlowerList
);
router.put(
  "/removedevicefollower/:serial",
  DeviceManagementController.putRemoveCustomerFromDeviceFollowerList
);
router.get("/listrequests", DeviceManagementController.getListRequestMake);
router.get(
  "/requeststodevice/:serial",
  DeviceManagementController.getListRequestToDevice
);
router.put(
  "/responserequest",
  DeviceManagementController.putResponseRequestToDevice
);
router.post(
  "/createrequestfollowdevice",
  DeviceManagementController.postCreateRequestFollowDevice
);
router.put(
  "/removerequestfollowdevice",
  DeviceManagementController.putRemoveRequestFollowDevice
);

export default router;
