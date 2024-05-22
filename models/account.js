import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";
import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";

const TAG = "ACCOUNT_MODEL";
// Define the schema
const accountSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.length >= 9 && value.length <= 11,
      message: "Phone number must be between 9 and 11 characters",
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "staff", "customer"],
    required: true,
  },
  profileId: {
    type: Schema.Types.ObjectId,
  },
  firstCreated: actionRecord,
  lastModified: actionRecord,
});

accountSchema.statics.findWithId = async function (id) {
  let result = await this.findById(id);
  if (!result) {
    throw new Exception(
      Exception.ACCOUNT_CANNOT_FIND_ID + id,
      TAG,
      "findWithId",
      HTTPCode.BAD_REQUEST
    );
  }
  return result;
};

accountSchema.statics.findByPhoneNumber = async function ({ phoneNumber }) {
  let result = await this.findOne({ phoneNumber: phoneNumber });
  if (!result) {
    throw new Exception(
      Exception.ACCOUNT_CANNOT_FIND_PHONE_NUMBER + phoneNumber,
      TAG,
      "findByPhoneNumber",
      HTTPCode.BAD_REQUEST
    );
  }
  return result;
};

accountSchema.statics.checkPhoneNumberNotExist = async function ({
  phoneNumber,
}) {
  let result = await this.findOne({ phoneNumber: phoneNumber });
  if (result) {
    throw new Exception(
      Exception.ACCOUNT_PHONE_NUMBER_EXIST + phoneNumber,
      TAG,
      "checkPhoneNumberNotExist",
      HTTPCode.BAD_REQUEST
    );
  }
};

// Create and export the model
export default mongoose.model("account", accountSchema);
