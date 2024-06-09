import { handleException } from "../../../exception/Exception.js";
import { logi } from "../../../helpers/log.js";
import { Device } from "../../../models/index.js";
import { getShortProfile } from "../../profileManagement/profileHelper.js";

const TAG = "DEVICE HELPER";
const deviceShortDetail = async (deviceSerial) => {
  try {
    let device = await Device.findBySerial(deviceSerial);
    let returnDevice = {};
  } catch (exception) {
    await handleException(exception, TAG, "returnDeviceDetail");
  }
};

const returnDeviceDetail = async (deviceDetail) => {
  try {
    logi(TAG, "returnDeviceDetail", deviceDetail);
    let returnDeviceDetail = { ...deviceDetail._doc };
    returnDeviceDetail.deviceManager
      ? (returnDeviceDetail.deviceManager = await getShortProfile(
          deviceDetail.deviceManager
        ))
      : {};
    returnDeviceDetail.deviceOwner
      ? (returnDeviceDetail.deviceOwner = await getShortProfile(
          deviceDetail.deviceOwner
        ))
      : {};
    returnDeviceDetail.lastModified = await getShortProfile(
      deviceDetail.lastModified.editedBy,
      deviceDetail.lastModified.editedTime
    );
    returnDeviceDetail.firstCreated = await getShortProfile(
      deviceDetail.firstCreated.editedBy,
      deviceDetail.firstCreated.editedTime
    );
    return returnDeviceDetail;
  } catch (exception) {
    await handleException(exception, TAG, "returnDeviceDetail");
  }
};

export default returnDeviceDetail;
