import UserManagementHelper from "./userManagementHelper/index.js";
import Exception, { handleException } from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import {
  checkAdminRight,
  checkCustomerRight,
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
    await handleException(exception, TAG, "getListStaff");
  }
};

const getListStaffByCustomerId = async ({
  accountJWT,
  searchString,
  page,
  size,
  subProfileId,
}) => {
  try {
    logi(TAG, "getListStaffByCustomerId", {
      accountJWT,
      searchString,
      page,
      size,
      subProfileId,
    });
    await checkCustomerRight(accountJWT.role);
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findWithId(accountJWT.role);
      let staffSubList = await arrayId.findById(staffProfile.listSubProfile);
      if (!staffSubList.includes(subProfileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getListStaffByCustomerId",
          HTTPCode.BAD_REQUEST
        );
      }
    }

    if (accountJWT.role === "customer") {
      if (!accountJWT.profileId.equals(ObjectId(subProfileId))) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getListStaffByCustomerId",
          HTTPCode.BAD_REQUEST
        );
      }
    }
    let result = await UserManagementHelper.getListSuper({
      searchString,
      page,
      size,
      subProfileId,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListStaffByCustomerId");
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
    await handleException(exception, TAG, "getStaffAccount");
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
    await handleException(exception, TAG, "getStaffProfile");
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
    await handleException(exception, TAG, "putStaffAccount");
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
    await handleException(exception, TAG, "putStaffProfile");
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
    await handleException(exception, TAG, "postCreateNewStaff");
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
    await handleException(exception, TAG, "putRemoveCustomerFromStaffSubId");
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
    await handleException(exception, TAG, "putAddCustomerToStaffSubId");
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
    await handleException(exception, TAG, "getCustomerList");
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
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffSubList = await arrayId.findById(staffProfile.listSubProfile);
      let customerAccount = await Account.findWithId(accountId);
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
    await handleException(exception, TAG, "getCustomerAccount");
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
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffSubList = await arrayId.findById(staffProfile.listSubProfile);
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
    await handleException(exception, TAG, "getCustomerProfile");
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
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffSubList = await arrayId.findById(staffProfile.listSubProfile);
      let customerAccount = await Account.findWithId(accountId);
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
    await handleException(exception, TAG, "putCustomerAccount");
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
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffSubList = await arrayId.findById(staffProfile.listSubProfile);
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
    await handleException(exception, TAG, "putCustomerProfile");
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
    await handleException(exception, TAG, "postCreateNewCustomer");
  }
};
export default {
  getCustomerList,
  getCustomerAccount,
  getCustomerProfile,
  getListStaffByCustomerId,
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
