import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";
import isEmail from "validator/lib/isEmail.js";

import HTTPCode from "../exception/HTTPStatusCode.js";
import Exception from "../exception/Exception.js";
import { logi } from "../helpers/log.js";

const TAG = "PROFILE_MODEL";
const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: { validator: (value) => value.length > 5 },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.length >= 9 && value.length <= 11,
      message: "Phone number must be between 9 and 11 characters",
    },
  },
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    required: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.email && value.trim() != "") {
          return isEmail(value);
        }
        return true;
      },
      message: `Email is incorrect format`,
    },
  },
  address: {
    type: String,
  },
  lastModified: actionRecord,
  accountId: { type: Schema.Types.ObjectId },
  listSubProfile: { type: Schema.Types.ObjectId },
  listSuperProfile: { type: Schema.Types.ObjectId },
  listDevice: { type: Schema.Types.ObjectId },
});

profileSchema.statics.findByIdAndThrowIfNotFound = async function (
  id,
  exceptionMessage,
  func
) {
  logi(TAG, "findByIdAndThrowIfNotFound", `${id}`);
  let result = await this.findById(id);
  if (!result) {
    throw new Exception(exceptionMessage + id, TAG, func, HTTPCode.BAD_REQUEST);
  }
  logi(TAG, "findByIdAndThrowIfNotFound", result);
  return result;
};

profileSchema.statics.findWithId = async function (id) {
  logi(TAG, "findWithId", `${id}`);
  return this.findByIdAndThrowIfNotFound(
    id,
    Exception.PROFILE_DATA_NOT_EXIST,
    "findWithId"
  );
};

profileSchema.statics.findStaffWithId = async function (id) {
  return this.findByIdAndThrowIfNotFound(
    id,
    Exception.PROFILE_STAFF_NOT_EXIST,
    "findStaffWithId"
  );
};

profileSchema.statics.findCustomerWithId = async function (id) {
  return this.findByIdAndThrowIfNotFound(
    id,
    Exception.PROFILE_CUSTOMER_NOT_EXIST,
    "findCustomerWithId"
  );
};

profileSchema.statics.findByPhoneNumber = async function ({ phoneNumber }) {
  let result = await this.findOne({ phoneNumber: phoneNumber });
  if (!result) {
    throw new Exception(
      Exception.PROFILE_CANNOT_FIND_PHONE_NUMBER + phoneNumber,
      TAG,
      "findByPhoneNumber",
      HTTPCode.BAD_REQUEST
    );
  }
  return result;
};

export default mongoose.model("profile", profileSchema);
