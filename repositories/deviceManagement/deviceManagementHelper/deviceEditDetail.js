import Exception, { handleException } from "../../../exception/Exception.js";
import HTTPCode from "../../../exception/HTTPStatusCode.js";
import { logi } from "../../../helpers/log.js";
import { ArrayId, Device, Profile } from "../../../models/index.js";
import returnDeviceDetail from "./helper.js";
import { UserManagementRepository } from "../../index.js";

const TAG = "EDIT DEVICE DETAIL";

const putEditDeviceDetail = async ({
  editorProfileId,
  deviceSerial,
  deviceName,
  deviceAddress,
}) => {
  try {
    logi(TAG, "putEditDeviceDetail", { deviceSerial });

    let deviceExist = await Device.findBySerial(deviceSerial);

    let updated = false;

    if (deviceName !== undefined && deviceName !== "") {
      deviceExist.deviceName = deviceName;
      updated = true;
    }
    if (deviceAddress !== undefined && deviceAddress !== "") {
      deviceExist.deviceAddress = deviceAddress;
      updated = true;
    }

    if (updated) {
      let editorProfile = await Profile.findWithId(editorProfileId);
      deviceExist.lastModified = {
        editedBy: editorProfile._id,
      };

      await deviceExist.save();
    }
    let returnDataDevice = await returnDeviceDetail(deviceExist);

    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "putEditDeviceDetail");
  }
};

const putAdminChangeDeviceOwner = async ({
  accountJWT,
  newOwnerId,
  deviceSerial,
}) => {
  try {
    logi(TAG, "putAdminChangeDeviceOwner", {
      accountJWT,
      newOwnerId,
      deviceSerial,
    });
    let ownerProfile = await Profile.findWithId(newOwnerId);
    if (ownerProfile.role !== "customer") {
      throw new Exception(
        Exception.PROFILE_CUSTOMER_NOT_EXIST,
        TAG,
        "putAdminChangeDeviceOwner",
        HTTPCode.BAD_REQUEST
      );
    }
    let ownerListDevice = await ArrayId.findById(ownerProfile.listDevice);
    let deviceExist = await Device.findBySerial(deviceSerial);
    deviceExist.deviceOwner = newOwnerId;
    deviceExist.lastModified = { editedBy: accountJWT.profileId };
    await deviceExist.save();
    ownerListDevice.ids.push(deviceExist._id);
    ownerListDevice.save();
    if (deviceExist.deviceManager && deviceExist.deviceManager !== "") {
      await UserManagementRepository.putAddCustomerToStaffSubId({
        accountJWT: accountJWT,
        staffProfileId: deviceExist.deviceManager,
        listNewSubId: [ownerProfile._id],
      });
    }
    let returnDataDevice = await returnDeviceDetail(deviceExist);
    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "putChangeDeviceOwner");
  }
};

const putStaffChangeDeviceOwner = async ({
  accountJWT,
  newOwnerId,
  deviceSerial,
}) => {
  try {
    logi(TAG, "putChangeDeviceOwner", {
      accountJWT,
      newOwnerId,
      deviceSerial,
    });
    let ownerProfile = await Profile.findWithId(newOwnerId);
    if (ownerProfile.role !== "customer") {
      throw new Exception(
        Exception.PROFILE_CUSTOMER_NOT_EXIST,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }
    let ownerListDevice = await ArrayId.findById(ownerProfile.listDevice);
    let deviceExist = await Device.findBySerial(deviceSerial);
    deviceExist.deviceOwner = newOwnerId;
    deviceExist.lastModified = { editedBy: accountJWT.profileId };
    await deviceExist.save();
    ownerListDevice.ids.push(deviceExist._id);
    ownerListDevice.save();

    let returnDataDevice = await returnDeviceDetail(deviceExist);
    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "putChangeDeviceOwner");
  }
};

const putChangeDeviceManager = async ({
  accountJWT,
  newManagerId,
  deviceSerial,
}) => {
  try {
    logi(TAG, "putChangeDeviceManager", {
      accountJWT,
      newManagerId,
      deviceSerial,
    });

    let managerProfile = await Profile.findWithId(newManagerId);
    if (managerProfile.role !== "staff") {
      throw new Exception(
        Exception.PROFILE_STAFF_NOT_EXIST,
        TAG,
        "putChangeDeviceManager",
        HTTPCode.BAD_REQUEST
      );
    }
    let managerListDevice = await ArrayId.findById(managerProfile.listDevice);

    let deviceExist = await Device.findBySerial(deviceSerial);
    deviceExist.deviceManager = newManagerId;
    deviceExist.lastModified = { editedBy: accountJWT.profileId };
    await deviceExist.save();

    managerListDevice.ids.push(deviceExist._id);
    await managerListDevice.save();

    if (deviceExist.deviceOwner && deviceExist.deviceOwner !== "") {
      await UserManagementRepository.putAddCustomerToStaffSubId({
        accountJWT,
        staffProfileId: newManagerId,
        listNewSubId: [deviceExist.deviceOwner],
      });
    }
    let returnDataDevice = await returnDeviceDetail(deviceExist);
    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "putChangeDeviceManager");
  }
};

export default {
  putEditDeviceDetail,
  putAdminChangeDeviceOwner,
  putStaffChangeDeviceOwner,
  putChangeDeviceManager,
  // putAddCustomerToDeviceFlowerList,
  // putRemoveCustomerFromDeviceFollowerList,
};
