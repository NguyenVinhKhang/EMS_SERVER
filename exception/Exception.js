import { loge } from "../helpers/log.js";
import HTTPCode from "./HTTPStatusCode.js";

class Exception extends Error {
  //chung
  static MISSING_PARAMETER = "Missing ";

  // Nhóm "db"
  static DB_WRONG_USERNAME_PASSWORD = "Wrong database's userName or password";
  static DB_WRONG_CONNECTION_STRING = "Wrong database connection string";
  static DB_CANNOT_CONNECT_MONGODB = "Cannot connect to MongoDB";

  // Nhóm "account"
  static ACCOUNT_CANNOT_FIND_ID = "Cannot find account with id: ";
  static ACCOUNT_CANNOT_FIND_PHONE_NUMBER =
    "Cannot find account with phone number: ";
  static ACCOUNT_PHONE_NUMBER_EXIST = "Phone number already exists: ";
  static ACCOUNT_PASSWORD_INVALID = "Password is invalid";
  static STAFF_IS_NOT_EXIST = "Staff does not exist";
  static ACCOUNT_OLD_PASSWORD_INCORRECT = "Old password is incorrect";
  static ACCOUNT_NEW_PASSWORD_NOT_MATCH =
    "New password does not match each other";
  static ACCOUNT_NEW_PHONE_NUMBER_NOT_MATCH =
    "New phone number does not match each other";
  static ACCOUNT_ACCESS_DENIED = "Access denied";

  // Nhóm "profile"
  static PROFILE_CANNOT_FIND_ID = "Cannot find account with id: ";
  static PROFILE_DATA_NOT_EXIST = "Profile data does not exist ";
  static PROFILE_CUSTOMER_NOT_EXIST = "Profile customer does not exist ";
  static PROFILE_STAFF_NOT_EXIST = "Profile staff does not exist ";
  static PROFILE_STAFF_NOT_EXIST = "Staff profile does not exist with id: ";
  static PROFILE_CUSTOMER_NOT_EXIST =
    "Customer profile does not exist with id:";
  static PROFILE_CANNOT_FIND_PHONE_NUMBER =
    "Cannot find profile with phone number: ";

  //Device
  static DEVICE_NOT_FOUND_SERIAL = `Cannot find device with serial: `;
  static DEVICE_NOT_FOUND_ID = `Cannot find device with id: `;
  static DEVICE_EXIST = `Device already exists`;
  static DEVICE_REQUEST_ALREADY_EXIST = `Device Serial already exists in the request pool`;
  static REQUEST_DOES_NOT_EXIST = "Request dose not exist";

  //Nhóm khác
  static ABSTRACT_CLASS_CREATED =
    "Cannot construct abstract instances directly";
  static INVALID_ARRAY = "Array is invalid";

  constructor(message, tag, func, statusCode, validationErrors = {}) {
    super(message);
    loge(tag, func, message);
    if (statusCode) {
      this.statusCode = statusCode;
    }
    if (validationErrors) {
      this.validationErrors = validationErrors;
    }
  }
}

const handleException = async (exception, tag, func) => {
  if (exception instanceof Exception) {
    throw exception;
  } else {
    throw new Exception(exception, tag, func, HTTPCode.INTERNAL_SERVER_ERROR);
  }
};
export default Exception;
export { handleException };
