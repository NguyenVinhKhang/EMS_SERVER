import { ObjectId } from "mongodb";
import { logi } from "../../../helpers/log.js";
import { ArrayId, Profile } from "../../../models/index.js";
import { handleException } from "../../../exception/Exception.js";

const TAG = "LIST USER";

const getListCustomerWithStaffId = async ({
  searchString,
  page,
  size,
  staffId,
}) => {
  try {
    logi(TAG, "getListCustomerWithStaffId", {
      searchString,
      page,
      size,
      staffId,
    });
    let arrayIds = [];
    if (staffId === "") {
      const objectIds = await ArrayId.find({ ids: { $size: 0 } }).select("_id");
      arrayIds = objectIds.map((obj) => ObjectId(obj._id.toString()));
    }
    if (staffId !== "" && staffId !== undefined) {
      let staffProfile = await Profile.findWithId(staffId);
      let listSubCustomer = await ArrayId.findById(staffProfile.listSubProfile);
      arrayIds = listSubCustomer.ids;
    }
    let matchConditions = {
      role: "customer",
    };
    if (arrayIds.length !== 0) {
      if (staffId === "") {
        matchConditions.listSuperProfile = { $in: arrayIds };
      } else {
        matchConditions._id = { $in: arrayIds };
      }
    } else {
      return { resultSize: 0, result: [] };
    }

    logi(TAG, "getListCustomerWithStaffId", matchConditions);

    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { phoneNumber: { $regex: new RegExp(searchString.trim(), "i") } },
        { name: { $regex: new RegExp(searchString.trim(), "i") } },
        { email: { $regex: new RegExp(searchString.trim(), "i") } },
        { address: { $regex: new RegExp(searchString.trim(), "i") } },
      ];
    }

    const profiles = await Profile.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
    ]);

    return { resultSize: profiles.length, result: profiles };
  } catch (exception) {
    await handleException(exception, TAG, "getListCustomerWithStaffId");
  }
};

const getListSub = async ({
  accountJWT,
  searchString,
  page,
  size,
  roleFilter,
}) => {
  try {
    logi(TAG, "getListSub", {
      accountJWT,
      searchString,
      page,
      size,
    });
    // Find sub profile
    const superProfile = await Profile.findWithId(accountJWT.profileId);
    const listIdSub = await ArrayId.findById(superProfile.listSubProfile);
    if (!listIdSub || listIdSub.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }

    let matchConditions = {
      _id: { $in: listIdSub.ids },
      role: roleFilter,
    };

    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { phoneNumber: { $regex: new RegExp(searchString, "i") } },
        { name: { $regex: new RegExp(searchString, "i") } },
        { email: { $regex: new RegExp(searchString, "i") } },
        { address: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    const listSubResult = await Profile.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "_id",
          as: "profileDetails",
        },
      },
      { $unwind: "$profileDetails" },
      { $replaceRoot: { newRoot: "$profileDetails" } },
    ]);

    return {
      resultSize: listSubResult.length,
      result: listSubResult,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getListSub");
  }
};

const getListSuper = async ({ searchString, page, size, subProfileId }) => {
  try {
    logi(TAG, "getListSuper", {
      subProfileId,
      searchString,
      page,
      size,
    });
    // Find sub profile
    const subProfile = await Profile.findWithId(subProfileId);

    const listIdSuper = await ArrayId.findById(subProfile.listSuperProfile);
    logi(TAG, "getListSuper", listIdSuper);
    if (!listIdSuper || listIdSuper.ids.length === 0) {
      return { resultSize: 0, result: [] };
    }

    let matchConditions = {
      _id: { $in: listIdSuper.ids },
    };

    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { phoneNumber: { $regex: new RegExp(searchString, "i") } },
        { name: { $regex: new RegExp(searchString, "i") } },
        { email: { $regex: new RegExp(searchString, "i") } },
        { address: { $regex: new RegExp(searchString, "i") } },
      ];
      logi(TAG, "getListSuper", matchConditions);
    }

    const listSubResult = await Profile.aggregate([
      { $match: matchConditions },
      { $skip: (page - 1) * size },
      { $limit: size },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "_id",
          as: "profileDetails",
        },
      },
      { $unwind: "$profileDetails" },
      { $replaceRoot: { newRoot: "$profileDetails" } },
    ]);

    return {
      resultSize: listSubResult.length,
      result: listSubResult,
    };
  } catch (exception) {
    await handleException(exception, TAG, "getListSuper");
  }
};

export default { getListCustomerWithStaffId, getListSub, getListSuper };
