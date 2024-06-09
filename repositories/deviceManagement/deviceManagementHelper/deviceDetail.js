import { handleException } from "../../../exception/Exception.js";
import { logi } from "../../../helpers/log.js";
import { ArrayId, Device, Profile } from "../../../models/index.js";
import returnDeviceDetail from "./helper.js";

const TAG = "GET DEVICE DETAIL";

const getDeviceDetail = async ({ deviceSerial }) => {
  try {
    logi(TAG, "getDeviceDetail", { deviceSerial });

    let deviceDetail = await Device.findBySerial(deviceSerial);

    // Fetch details of deviceManager and deviceOwner concurrently
    let returnDataDevice = await returnDeviceDetail(deviceDetail);

    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "getDeviceDetail");
  }
};

const getListDeviceFollower = async ({
  deviceSerial,
  searchString,
  page,
  size,
}) => {
  try {
    logi(TAG, "getListDeviceFollower", {
      deviceSerial,
      searchString,
      page,
      size,
    });
    let deviceExist = await Device.findBySerial(deviceSerial);
    let listIdFollower = await ArrayId.findById(deviceExist.deviceFollower);
    if (listIdFollower.ids.length === 0 || !listIdFollower) {
      return {
        resultSize: 0,
        result: {},
      };
    }
    let matchConditions = {
      _id: { $in: listIdFollower.ids },
      role: "customer",
    };

    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { phoneNumber: { $regex: new RegExp(searchString.trim(), "i") } },
        { name: { $regex: new RegExp(searchString.trim(), "i") } },
        { email: { $regex: new RegExp(searchString.trim(), "i") } },
        { address: { $regex: new RegExp(searchString.trim(), "i") } },
      ];
    }
    logi(TAG, "getListCustomerWithStaffId", matchConditions);

    const profiles = await Profile.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);
    return { resultSize: profiles.length, result: profiles };
  } catch (exception) {
    await handleException(exception, TAG, "getListDeviceFollower");
  }
};

export default { getDeviceDetail, getListDeviceFollower };
