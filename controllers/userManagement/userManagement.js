import { UserManagementRepository } from "../../repositories/index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { tokenMap } from "../../authentication/tokenMap.js";
import MAX_RECORDS from "../../global/constant.js";

const TAG = "UserController";

const getListStaff = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    let { searchString = "", page = 1, size = MAX_RECORDS } = req.body;

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;
    logi(TAG, "getListStaff", {
      accountJWT,
      searchString,
      page,
      size,
    });
    let result = await UserManagementRepository.getListStaff({
      accountJWT,
      searchString,
      page,
      size,
    });
    res.status(HTTPCode.OK).json({
      message: "Get staff list successfully",
      data: result,
    });
  } catch (exception) {
    res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
};

const getStaffAccount = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const accountId = req?.params?.id;
    logi(TAG, "getStaffAccount", {
      accountJWT,
      accountId,
    });
    const result = await UserManagementRepository.getStaffAccount({
      accountJWT,
      accountId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get staff account successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const getStaffProfile = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const profileId = req?.params?.id;
    logi(TAG, "getStaffProfile", {
      accountJWT,
      profileId,
    });
    const result = await UserManagementRepository.getStaffProfile({
      accountJWT,
      profileId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get staff profile successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putStaffAccount = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    let accountId = req?.params?.id;
    const { newPhoneNumber, newPassword } = req.body;
    logi(TAG, "putStaffAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    const result = await UserManagementRepository.putStaffAccount({
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Update staff account successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putStaffProfile = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    let profileId = req?.params?.id;
    const { email, name, address } = req.body;
    logi(TAG, "putStaffProfile", {
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    const result = await UserManagementRepository.putStaffProfile({
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Update staff profile successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const postCreateNewStaff = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { password, phoneNumber, name } = req.body;
    logi(TAG, "postCreateNewStaff", {
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    const result = await UserManagementRepository.postCreateNewStaff({
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Create new staff successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putRemoveCustomerFromStaffSubId = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { listRemoveSubId, staffProfileId } = req.body;
    logi(TAG, "putRemoveCustomerFromStaffSubId", {
      accountJWT,
      listRemoveSubId,
      staffProfileId,
    });
    const result =
      await UserManagementRepository.putRemoveCustomerFromStaffSubId({
        accountJWT,
        listRemoveSubId,
        staffProfileId,
      });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Remove customer from staff successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putAddCustomerToStaffSubId = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { staffProfileId, listNewSubId } = req.body;
    logi(TAG, "putAddCustomerToStaffSubId", {
      accountJWT,
      staffProfileId,
      listNewSubId,
    });
    const result = await UserManagementRepository.putAddCustomerToStaffSubId({
      accountJWT,
      staffProfileId,
      listNewSubId,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Add customer to staff successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const getCustomerList = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const {
      searchString = "",
      page = 1,
      size = MAX_RECORDS,
      staffId,
    } = req.body;
    let newSize = size >= MAX_RECORDS ? MAX_RECORDS : size;
    logi(TAG, "getCustomerList", {
      accountJWT,
      searchString,
      page,
      size: newSize,
      staffId,
    });
    const result = await UserManagementRepository.getCustomerList({
      accountJWT,
      searchString,
      page,
      size: newSize,
      staffId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get customer list successfully",
      data: result,
    });
  } catch (exception) {
    res.status(HTTPCode.INTERNAL_SERVER_ERROR).json({
      message: exception.message,
    });
  }
};

const getCustomerAccount = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const accountId = req?.params?.id;
    logi(TAG, "getCustomerAccount", {
      accountJWT,
      accountId,
    });
    const result = await UserManagementRepository.getCustomerAccount({
      accountJWT,
      accountId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get customer account successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const profileId = req?.params?.id;
    logi(TAG, "getCustomerProfile", {
      accountJWT,
      profileId,
    });
    const result = await UserManagementRepository.getCustomerProfile({
      accountJWT,
      profileId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get customer profile successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putCustomerAccount = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const accountId = req?.params?.id;
    const { newPhoneNumber, newPassword } = req.body;
    logi(TAG, "putCustomerAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    const result = await UserManagementRepository.putCustomerAccount({
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Update customer account successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const putCustomerProfile = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const profileId = req?.params?.id;
    const { email, name, address } = req.body;
    logi(TAG, "putCustomerProfile", {
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    const result = await UserManagementRepository.putCustomerProfile({
      accountJWT,
      profileId,
      email,
      name,
      address,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Update customer profile successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

const postCreateNewCustomer = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { password, phoneNumber, name } = req.body;
    logi(TAG, "postCreateNewCustomer", {
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    const result = await UserManagementRepository.postCreateNewCustomer({
      accountJWT,
      password,
      phoneNumber,
      name,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Create new customer successfully",
      data: result,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message,
      });
  }
};

export default {
  getListStaff,
  getStaffAccount,
  getStaffProfile,
  putStaffAccount,
  putStaffProfile,
  postCreateNewStaff,
  putRemoveCustomerFromStaffSubId,
  putAddCustomerToStaffSubId,
  getCustomerList,
  getCustomerAccount,
  getCustomerProfile,
  putCustomerProfile,
  putCustomerAccount,
  postCreateNewCustomer,
};
