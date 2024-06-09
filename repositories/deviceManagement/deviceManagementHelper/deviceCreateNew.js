import { handleException } from "../../../exception/Exception.js";
import { logi } from "../../../helpers/log.js";
import { Device, Profile } from "../../../models/index.js";
import returnDeviceDetail from "./helper.js";
import { ObjectId } from "mongodb";

const TAG = "CREATE NEW DEVICE";

//CREATE NEW DEVICE
const postCreateNewDevice = async ({
  creatorProfileId,
  deviceSerial,
  deviceName,
  deviceAddress,
  deviceOwnerId,
  deviceManagerId,
}) => {
  try {
    logi(TAG, "postCreateNewDevice", {
      creatorProfileId,
      deviceSerial,
      deviceName,
      deviceAddress,
      deviceOwnerId,
      deviceManagerId,
    });
    await Device.checkDeviceExist(deviceSerial);
    let newDevice = {
      serial: deviceSerial,
    };
    if (deviceName !== undefined && deviceName !== "") {
      newDevice.deviceName = deviceName;
    }
    if (deviceAddress !== undefined && deviceAddress !== "") {
      newDevice.deviceAddress = deviceAddress;
    }
    if (deviceOwnerId !== undefined && deviceName !== "") {
      newDevice.deviceOwner = ObjectId(deviceOwnerId);
    }
    if (deviceManagerId !== undefined && deviceManagerId !== "") {
      newDevice.deviceManager = ObjectId(deviceManagerId);
    }
    let creatorProfile = await Profile.findWithId(creatorProfileId);
    newDevice.firstCreated = {
      editedBy: creatorProfile._id,
    };
    newDevice.lastModified = {
      editedBy: creatorProfile._id,
    };
    let createdDevice = await Device.create(newDevice);
    let returnDataDevice = await returnDeviceDetail(createdDevice);
    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "postCreateNewDevice");
  }
};

export default { postCreateNewDevice };
