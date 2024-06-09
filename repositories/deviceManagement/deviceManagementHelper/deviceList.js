import { handleException } from "../../../exception/Exception.js";
import { logi, logw } from "../../../helpers/log.js";
import { ArrayId, Device, Profile } from "../../../models/index.js";
import { ObjectId } from "mongodb";

const TAG = "LIST DEVICE";

const getListAllDevice = async ({ searchString, page, size }) => {
  try {
    logi(TAG, "getListAllDevice", { searchString, page, size });
    let matchConditions = {};
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
        { deviceName: { $regex: new RegExp(searchString, "i") } },
        { deviceAddress: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    const listDeviceById = await Device.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return {
      resultSize: listDeviceById.length,
      result: listDeviceById,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getListAllDevice");
  }
};

const getListDeviceManageById = async ({
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getListDeviceManageById", {
      searchString,
      page,
      size,
      profileId,
    });
    let profile = await Profile.findWithId(profileId);

    let listIdDevice = await ArrayId.findById(ObjectId(profile.listDevice));
    
    if (!listIdDevice || listIdDevice.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }
    let matchConditions = {
      _id: { $in: listIdDevice.ids },
    };
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
        { deviceName: { $regex: new RegExp(searchString, "i") } },
        { deviceAddress: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    logi(TAG, "getListDeviceManageById", {
      matchConditions,
    });

    const listDeviceById = await Device.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return {
      resultSize: listDeviceById.length,
      result: listDeviceById,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getListDeviceById");
  }
};

const getListDeviceFollowingById = async ({
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getListDeviceFollowingById", {
      searchString,
      page,
      size,
      profileId,
    });
    let profile = await Profile.findWithId(profileId);
    let listIdDevice = await ArrayId.findById(profile.listDeviceFollowing);
    logw(TAG, "getListDeviceFollowingById", listIdDevice);
    if (!listIdDevice || listIdDevice.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }
    let matchConditions = {
      _id: { $in: listIdDevice.ids },
    };
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
        { deviceName: { $regex: new RegExp(searchString, "i") } },
        { deviceAddress: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    const listDeviceById = await Device.aggregate([
    { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return {
      resultSize: listDeviceById.length,
      result: listDeviceById,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getListDeviceById");
  }
};
const getCustomerListManageDevice = async ({
  staffId,
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getCustomerListManageDevice", {
      searchString,
      page,
      size,
      profileId,
    });
    let profile = await Profile.findWithId(profileId);
    let listDeviceId = profile.listDevice;
    let listIdDevice = await ArrayId.findById(listDeviceId);
    if (!listIdDevice || listIdDevice.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }
    let matchConditions = {
      _id: { $in: listIdDevice.ids },
      deviceManager: ObjectId(staffId),
    };
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
        { deviceName: { $regex: new RegExp(searchString, "i") } },
        { deviceAddress: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    const listDeviceById = await Device.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $lookup: {
          from: "device",
          localField: "_id",
          foreignField: "_id",
          as: "deviceDetail",
        },
      },
      { $unwind: "$deviceDetail" },
      { $replaceRoot: { newRoot: "$deviceDetail" } },
    ]);

    return {
      resultSize: listDeviceById.length,
      result: listDeviceById,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getCustomerListManageDevice");
  }
};

const getCustomerListFollowingDevice = async ({
  staffId,
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getCustomerListFollowingDevice", {
      searchString,
      page,
      size,
      profileId,
    });
    let profile = await Profile.findWithId(profileId);
    let listDeviceId = profile.listDeviceFollowing;
    let listIdDevice = await ArrayId.findById(listDeviceId);
    if (!listIdDevice || listIdDevice.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }
    let matchConditions = {
      _id: { $in: listIdDevice.ids },
      deviceManager: ObjectId(staffId),
    };
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
        { deviceName: { $regex: new RegExp(searchString, "i") } },
        { deviceAddress: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    const listDeviceById = await Device.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $lookup: {
          from: "device",
          localField: "_id",
          foreignField: "_id",
          as: "deviceDetail",
        },
      },
      { $unwind: "$deviceDetail" },
      { $replaceRoot: { newRoot: "$deviceDetail" } },
    ]);

    return {
      resultSize: listDeviceById.length,
      result: listDeviceById,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getCustomerListFollowingDevice");
  }
};

export default {
  getListAllDevice,
  getListDeviceManageById,
  getListDeviceFollowingById,
  getCustomerListManageDevice,
  getCustomerListFollowingDevice,
};
