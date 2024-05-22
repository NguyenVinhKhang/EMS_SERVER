import { ObjectId } from "mongodb";
import Exception from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { Account, ArrayId, Profile } from "../../models/index.js";
import bcrypt from "bcrypt";
import { getShortProfile } from "../../helpers/getShortProfile.js";

const TAG = "UserManagementRepository";

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
      let staffProfile = await Profile.findById(staffId).exec();
      if (!staffProfile) {
        throw new Exception(
          Exception.PROFILE_DATA_NOT_EXIST + staffId,
          TAG,
          "getListCustomerWithStaffId",
          HTTPCode.BAD_REQUEST
        );
      }
      let listSubCustomer = await ArrayId.findById(
        staffProfile.listSubProfile
      ).exec();
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
    }

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
    ]).exec();

    return { resultSize: profiles.length, data: profiles };
  } catch (exception) {
    throw new Exception(
      `${exception}`,
      TAG,
      "getListCustomerWithStaffId",
      HTTPCode.BAD_REQUEST
    );
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
    const superProfile = await Profile.findById(accountJWT.profileId).exec();
    if (!superProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        "getListSub",
        HTTPCode.BAD_REQUEST
      );
    }
    const listIdSub = await ArrayId.findById(superProfile.listSubProfile);
    if (!listIdSub || listIdSub.ids.length === 0) {
      return { returnListUser: [], resultSize: 0 };
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
    ]).exec();

    return {
      resultSize: listSubResult.length,
      result: listSubResult,
    };
  } catch (exception) {
    throw new Exception(exception, TAG, "getListSub", HTTPCode.BAD_REQUEST);
  }
};

const getSubAccount = async ({ accountId }) => {
  try {
    logi(TAG, "getSubAccount", accountId);
    const subAccount = await Account.findById(accountId).exec();
    if (!subAccount) {
      throw new Exception(
        Exception.ACCOUNT_DATA_NOT_EXIST,
        TAG,
        "getSubAccount",
        HTTPCode.BAD_REQUEST
      );
    }
    let { password, ...returnAccount } = subAccount._doc;
    if (subAccount.lastModified) {
      returnAccount.lastModified = await getShortProfile(
        subAccount.lastModified.editedBy,
        subAccount.lastModified.editedTime
      );
    }
    if (subAccount.firstCreated) {
      returnAccount.firstCreated = await getShortProfile(
        subAccount.firstCreated.editedBy,
        subAccount.firstCreated.editedTime
      );
    }

    return returnAccount;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getSubAccount",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const getSubProfile = async ({ profileId }) => {
  try {
    logi(TAG, "getSubProfile", profileId);
    const subProfile = await Profile.findById(profileId).exec();
    if (!subProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        "getSubProfile",
        HTTPCode.BAD_REQUEST
      );
    }
    let { ...returnProfile } = subProfile._doc;
    if (subProfile.lastModified) {
      returnProfile.lastModified = await getShortProfile(
        subProfile.lastModified.editedBy,
        subProfile.lastModified.editedTime
      );
    }
    return returnProfile;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getSubProfile",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putSubAccount = async ({
  accountJWT,
  accountId,
  newPhoneNumber,
  newPassword,
}) => {
  try {
    logi(TAG, "putSubAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    const subAccount = await Account.findById(accountId).exec();
    if (!subAccount) {
      throw new Exception(
        Exception.ACCOUNT_DATA_NOT_EXIST,
        TAG,
        "putSubAccount",
        HTTPCode.BAD_REQUEST
      );
    }
    let isModified = false;
    if (
      newPassword !== undefined &&
      newPassword !== "" &&
      !(await bcrypt.compare(newPassword, subAccount.password))
    ) {
      const hashPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT_ROUNDS)
      );
      subAccount.password = hashPassword;
      isModified = true;
    }
    if (
      newPhoneNumber !== undefined &&
      newPhoneNumber !== "" &&
      newPhoneNumber !== subAccount.phoneNumber
    ) {
      let existPhoneNumber = await Account.findOne({
        phoneNumber: newPhoneNumber,
      }).exec();
      if (existPhoneNumber) {
        throw new Exception(
          Exception.ACCOUNT_PHONE_NUMBER_EXIST,
          TAG,
          "putStaffAccount",
          HTTPCode.BAD_REQUEST
        );
      }
      subAccount.phoneNumber = newPhoneNumber;
      logi(TAG, "putSubAccount", subAccount.profileId);
      let subProfile = await Profile.findById(subAccount.profileId).exec();
      logi(TAG, "putSubAccount", subProfile);
      subProfile.phoneNumber = newPhoneNumber;
      subProfile.lastModified.editedBy = accountJWT.profileId;
      await subProfile.save();
      isModified = true;
    }
    if (isModified) {
      subAccount.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await subAccount.save();
    }
    const { password, ...returnAccount } = subAccount._doc;
    returnAccount.lastModified = await getShortProfile(
      subAccount.lastModified.editedBy,
      subAccount.lastModified.editedTime
    );
    returnAccount.firstCreated = await getShortProfile(
      subAccount.firstCreated.editedBy,
      subAccount.firstCreated.editedTime
    );
    return returnAccount;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putSubAccount",
        HTTPCode.INSERT_FAIL
      );
    }
  }
};

const putSubProfile = async ({
  accountJWT,
  profileId,
  email,
  name,
  address,
}) => {
  logi(TAG, "putSubProfile", {
    accountJWT,
    profileId,
    email,
    name,
    address,
  });
  try {
    const subProfile = await Profile.findById(profileId).exec();
    if (!subProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        "putSubProfile",
        HTTPCode.INSERT_FAIL
      );
    }
    let isModified = false;
    if (name !== undefined && subProfile.name !== name) {
      subProfile.name = name;
      isModified = true;
    }
    if (email !== undefined && subProfile.email !== email) {
      subProfile.email = email;
      isModified = true;
    }
    if (address !== undefined && subProfile.address !== address) {
      subProfile.address = address;
      isModified = true;
    }

    if (isModified) {
      subProfile.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await subProfile.save();
    }
    let { ...returnProfile } = subProfile._doc;
    if (subProfile.lastModified) {
      returnProfile.lastModified = await getShortProfile(
        subProfile.lastModified.editedBy,
        subProfile.lastModified.editedTime
      );
    }
    return returnProfile;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putSubProfile",
        HTTPCode.INSERT_FAIL
      );
    }
  }
};

const postCreateNewUser = async ({
  accountJWT,
  password,
  phoneNumber,
  name,
  role,
}) => {
  try {
    logi(TAG, "postCreateNewUser", {
      accountJWT,
      password,
      phoneNumber,
      name,
      role,
    });
    const existingAccount = await Account.findOne({
      phoneNumber,
    }).exec();

    if (existingAccount) {
      throw new Exception(
        Exception.ACCOUNT_PHONE_NUMBER_EXIST,
        TAG,
        "postCreateNewUser",
        HTTPCode.INSERT_FAIL
      );
    }
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const superProfile = await Profile.findById(accountJWT.profileId).exec();
    const superListSub = await ArrayId.findById(
      superProfile.listSubProfile
    ).exec();

    const newAccount = new Account({
      phoneNumber: phoneNumber,
      password: hashPassword,
      role: role,
      firstCreated: {
        editedBy: superProfile._id,
      },
      lastModified: {
        editedBy: superProfile._id,
      },
    });

    const newProfile = new Profile({
      name: name,
      phoneNumber: phoneNumber,
      role: role,
      address: "",
      email: "",
      lastModified: {
        editedBy: superProfile._id,
      },
    });

    // Lưu newAccount và newProfile để lấy _id cho các bước tiếp theo
    await newAccount.save();
    await newProfile.save();

    newAccount.profileId = newProfile._id;
    newProfile.accountId = newAccount._id;

    let listSuperId = new ArrayId({ ids: [accountJWT.profileId] });
    await listSuperId.save();
    newProfile.listSuperProfile = listSuperId._id;

    if (role === "staff") {
      let listSubId = new ArrayId({ ids: [] });
      await listSubId.save();
      newProfile.listSubProfile = listSubId._id;
    }

    // Cập nhật newProfile với listSuperProfile và (nếu cần) listSubProfile
    await newProfile.save();

    // Cập nhật superListSub và listSuperId
    superListSub.ids.push(newProfile._id);
    await superListSub.save();

    const returnAccount = { ...newAccount._doc };
    delete returnAccount.password;

    if (newAccount.lastModified) {
      returnAccount.lastModified = await getShortProfile(
        newAccount.lastModified.editedBy,
        newAccount.lastModified.editedTime
      );
    }

    if (newAccount.firstCreated) {
      returnAccount.firstCreated = await getShortProfile(
        newAccount.firstCreated.editedBy,
        newAccount.firstCreated.editedTime
      );
    }

    return returnAccount;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "postCreateNewUser",
        HTTPCode.INSERT_FAIL
      );
    }
  }
};

const putAddCustomerToStaffSubId = async ({
  accountJWT,
  staffProfileId,
  listNewSubId,
}) => {
  try {
    logi(TAG, "putAddCustomerToStaffSubId", {
      accountJWT,
      staffProfileId,
      listNewSubId,
    });
    if (!Array.isArray(listNewSubId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    // Find staff profile
    const staffProfile = await Profile.findById(
      ObjectId(staffProfileId)
    ).exec();

    if (!staffProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST + staffProfileId,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    // Find staff listSubProfile
    let staffListSubId = await ArrayId.findById(
      staffProfile.listSubProfile
    ).exec();

    let isModified = false;
    // add id to listSubProfile
    if (listNewSubId.length > 0) {
      for (const element of listNewSubId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findById(elementId);
        if (!existCustomer) {
          throw new Exception(
            Exception.PROFILE_DATA_NOT_EXIST + `:${elementId}`,
            TAG,
            "putAddCustomerToStaffSubId",
            HTTPCode.BAD_REQUEST
          );
        }
        const listCustomerSuperProfile = await ArrayId.findById(
          existCustomer.listSuperProfile
        );
        if (!staffListSubId.ids.some((id) => id.equals(elementId))) {
          // staff save new sub id
          staffListSubId.ids.push(elementId);
          await staffListSubId.save();

          // customer save super id
          listCustomerSuperProfile.ids.push(staffProfile._id);

          if (
            staffListSubId.isModified("ids") &&
            listCustomerSuperProfile.isModified("ids")
          ) {
            await staffListSubId.save();
            await listCustomerSuperProfile.save(); // save
            existCustomer.lastModified = { editedBy: accountJWT.profileId };
            await existCustomer.save();
            isModified = true;
          }
        }
      }

      // update listSubProfile
      if (isModified) {
        staffProfile.lastModified = {
          editedBy: accountJWT.profileId,
        };

        // save to database
        await staffProfile.save();
      }
    }
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        Exception.INTERNAL_SERVER_ERROR,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

const putRemoveCustomerFromStaffSubId = async ({
  accountJWT,
  staffProfileId,
  listRemoveSubId,
}) => {
  try {
    logi(TAG, "putRemoveCustomerFromStaffSubId", {
      accountJWT,
      staffProfileId,
      listRemoveSubId,
    });
    // check Array
    if (!Array.isArray(listRemoveSubId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    const staffProfile = await Profile.findById(
      ObjectId(staffProfileId)
    ).exec();

    if (!staffProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    const staffListSubId = await ArrayId.findById(
      staffProfile.listSubProfile
    ).exec();

    let isModified = false;
    // Remove id in listRemoveSubId
    if (listRemoveSubId.length > 0) {
      for (const element of listRemoveSubId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findById(elementId);
        if (!existCustomer) {
          throw new Exception(
            Exception.PROFILE_DATA_NOT_EXIST + `:${elementId}`,
            TAG,
            "putAddCustomerToStaffSubId",
            HTTPCode.BAD_REQUEST
          );
        }
        const listCustomerSuperProfile = await ArrayId.findById(
          existCustomer.listSuperProfile
        );
        // remove sub id
        staffListSubId.ids = staffListSubId.ids.filter(
          (id) => !id.equals(elementId)
        );

        //remove super id
        listCustomerSuperProfile.ids = listCustomerSuperProfile.ids.filter(
          (id) => !id.equals(staffProfile._id)
        );

        if (
          staffListSubId.isModified("ids") &&
          listCustomerSuperProfile.isModified("ids")
        ) {
          await staffListSubId.save();
          await listCustomerSuperProfile.save(); // save
          existCustomer.lastModified = { editedBy: accountJWT.profileId };
          await existCustomer.save();
          isModified = true;
        }
      }
    }

    if (isModified) {
      staffProfile.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await staffProfile.save();
    }
    return "Remove success";
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        Exception.INTERNAL_SERVER_ERROR,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

export default {
  getListCustomerWithStaffId,
  getListSub,
  getSubAccount,
  getSubProfile,
  putSubAccount,
  putSubProfile,
  postCreateNewUser,
  putAddCustomerToStaffSubId,
  putRemoveCustomerFromStaffSubId,
};
