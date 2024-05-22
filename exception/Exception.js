import { loge } from "../helpers/log.js";

export default class Exception extends Error {
  //chung
  static MISSING_PARAMETER = "Missing ";

  // Nhóm "db"
  static DB_WRONG_USERNAME_PASSWORD = "Wrong database's userName or password";
  static DB_WRONG_CONNECTION_STRING = "Wrong database connection string";
  static DB_CANNOT_CONNECT_MONGODB = "Cannot connect to MongoDB";

  // Nhóm "account"
  static ACCOUNT_DATA_NOT_EXIST = "Account data does not exist ";
  static ACCOUNT_PHONE_NUMBER_EXIST = "Phone number already exists";
  static ACCOUNT_PHONE_NUMBER_NOT_EXIST = "Phone number does not exist";
  static ACCOUNT_PASSWORD_INVALID = "Password is invalid";
  static ACCOUNT_WRONG_USERNAME_OR_PASSWORD = "Wrong username or password";
  static STAFF_IS_NOT_EXIST = "Staff does not exist";
  static INPUT_FAIL = "Input fail";
  static ACCOUNT_OLD_PASSWORD_INCORRECT = "Old password is incorrect";
  static ACCOUNT_NEW_PASSWORD_NOT_MATCH =
    "New password does not match each other";
  static ACCOUNT_NEW_PHONE_NUMBER_NOT_MATCH =
    "New phone number does not match each other";
  static ACCOUNT_ACCESS_DENIED = "Access denied";

  // Nhóm "profile"
  static PROFILE_EMAIL_EXIST = "Email already exists";
  static PROFILE_DATA_NOT_EXIST = "Profile data does not exist ";

  //Device
  static DEVICE_NOT_FOUND = `Cannot find device with serial `;
  static DEVICE_EXIST = `Device already exists`;

  //Nhóm khác
  static ABSTRACT_CLASS_CREATED =
    "Cannot construct abstract instances directly";
  static INVALID_ARRAY = "Array in invalid";
  constructor(message, tag, func, statusCode, validationErrors = {}) {
    super(message);
    loge(tag, func, message);
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}
