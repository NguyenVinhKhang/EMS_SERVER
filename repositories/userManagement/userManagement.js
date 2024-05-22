import UserManagementHelper from "./userManagementHelper.js";
import Exception from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import {
  checkAdminRight,
  checkStaffRight,
} from "../../global/authorization.js";
import { logi } from "../../helpers/log.js";
import { Account, Profile } from "../../models/index.js";
import arrayId from "../../models/arrayId.js";

const TAG = "UserManagementRepository";

const getListStaff = async ({ accountJWT, searchString, page, size }) => {
  try {
    logi(TAG, "getListStaff", {
      accountJWT,
      searchString,
      page,
      size,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.getListSub({
      accountJWT,
      searchString,
      page,
      size,
      roleFilter: "staff",
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getListStaff",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

const getStaffAccount = async ({ accountJWT, accountId }) => {
  try {
    logi(TAG, "getStaffAccount", {
      accountJWT,
      accountId,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.getSubAccount({ accountId });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getStaffAccount",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const getStaffProfile = async ({ accountJWT, profileId }) => {
  try {
    logi(TAG, "getStaffProfile", {
      accountJWT,
      profileId,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.getSubProfile({ profileId });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getStaffProfile",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putStaffAccount = async ({
  accountJWT,
  accountId,
  newPhoneNumber,
  newPassword,
}) => {
  try {
    logi(TAG, "putStaffAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.putSubAccount({
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putStaffAccount",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putStaffProfile = async ({
  accountJWT,
  profileId,
  email,
  name,
  address,
}) => {
  try {
    logi(TAG, "putStaffProfile", {
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.putSubProfile({
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putStaffProfile",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const postCreateNewStaff = async ({
  accountJWT,
  password,
  phoneNumber,
  name,
}) => {
  try {
    logi(TAG, "postCreateNewStaff", {
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.postCreateNewUser({
      accountJWT,
      password,
      phoneNumber,
      name,
      role: "staff",
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "postCreateNewStaff",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putRemoveCustomerFromStaffSubId = async ({
  accountJWT,
  listRemoveSubId,
  staffProfileId,
}) => {
  try {
    logi(TAG, "putRemoveCustomerFromStaffSubId", {
      accountJWT,
      listRemoveSubId,
      staffProfileId,
    });
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.putRemoveCustomerFromStaffSubId({
      accountJWT,
      listRemoveSubId,
      staffProfileId,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.BAD_REQUEST
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
    await checkAdminRight(accountJWT.role);
    let result = await UserManagementHelper.putAddCustomerToStaffSubId({
      accountJWT,
      staffProfileId,
      listNewSubId,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

//CUSTOMER MANAGEMENT
const getCustomerList = async ({
  accountJWT,
  searchString,
  page,
  size,
  staffId,
}) => {
  try {
    logi(TAG, "getCustomerList", {
      accountJWT,
      searchString,
      page,
      size,
      staffId,
    });
    let result;
    await checkStaffRight(accountJWT.role);
    result = await UserManagementHelper.getListCustomerWithStaffId({
      searchString,
      page,
      size,
      staffId,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getCustomerList",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
  }
};

const getCustomerAccount = async ({ accountJWT, accountId }) => {
  try {
    logi(TAG, "getCustomerAccount", {
      accountJWT,
      accountId,
    });
    await checkStaffRight(accountJWT.role);
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findById(accountJWT.profileId).exec();
      let staffSubList = await arrayId
        .findById(staffProfile.listSubProfile)
        .exec();
      let customerAccount = await Account.findById(accountId).exec();
      if (!staffSubList.includes(customerAccount.profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getCustomerAccount",
          HTTPCode.BAD_REQUEST
        );
      }
    }
    let result = UserManagementHelper.getSubAccount({ accountId });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getCustomerAccount",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const getCustomerProfile = async ({ accountJWT, profileId }) => {
  try {
    logi(TAG, "getCustomerProfile", {
      accountJWT,
      profileId,
    });
    await checkStaffRight(accountJWT.role);
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findById(accountJWT.profileId).exec();
      let staffSubList = await arrayId
        .findById(staffProfile.listSubProfile)
        .exec();
      if (!staffSubList.includes(profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getCustomerProfile",
          HTTPCode.BAD_REQUEST
        );
      }
    }
    let result = UserManagementHelper.getSubProfile({ profileId });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "getCustomerProfile",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putCustomerAccount = async ({
  accountJWT,
  accountId,
  newPhoneNumber,
  newPassword,
}) => {
  try {
    logi(TAG, "putCustomerAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    await checkStaffRight(accountJWT.role);
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findById(accountJWT.profileId).exec();
      let staffSubList = await arrayId
        .findById(staffProfile.listSubProfile)
        .exec();
      let customerAccount = await Account.findById(accountId).exec();
      if (!staffSubList.includes(customerAccount.profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getCustomerAccount",
          HTTPCode.BAD_REQUEST
        );
      }
    }
    let result = UserManagementHelper.putSubAccount({
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putCustomerAccount",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const putCustomerProfile = async ({
  accountJWT,
  profileId,
  email,
  name,
  address,
}) => {
  try {
    logi(TAG, "putCustomerProfile", {
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    await checkStaffRight(accountJWT.role);
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findById(accountJWT.profileId).exec();
      let staffSubList = await arrayId
        .findById(staffProfile.listSubProfile)
        .exec();
      if (!staffSubList.includes(profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getCustomerProfile",
          HTTPCode.BAD_REQUEST
        );
      }
    }
    let result = UserManagementHelper.putSubProfile({
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "putCustomerProfile",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};

const postCreateNewCustomer = async ({
  accountJWT,
  password,
  phoneNumber,
  name,
}) => {
  try {
    logi(TAG, "postCreateNewCustomer", {
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    await checkStaffRight(accountJWT.role);
    let result = UserManagementHelper.postCreateNewUser({
      accountJWT,
      password,
      phoneNumber,
      name,
      role: "customer",
    });
    return result;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "postCreateNewCustomer",
        HTTPCode.BAD_REQUEST
      );
    }
  }
};
export default {
  getCustomerList,
  getCustomerAccount,
  getCustomerProfile,
  putCustomerAccount,
  putCustomerProfile,
  postCreateNewCustomer,
  getListStaff,
  getStaffAccount,
  getStaffProfile,
  putStaffAccount,
  putStaffProfile,
  postCreateNewStaff,
  putAddCustomerToStaffSubId,
  putRemoveCustomerFromStaffSubId,
};
