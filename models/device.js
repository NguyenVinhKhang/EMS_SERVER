import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";
import { pathRecord } from "./pathInfo.js";
import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";
import { logi } from "../helpers/log.js";

const TAG = "DEVICE MODEL";
// Define the schema
const deviceSchema = new Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.length === 12,
      message: "Device Serial must be 12 characters",
    },
  },
  deviceName: {
    type: String,
  },
  path0: pathRecord,
  path1: pathRecord,
  path2: pathRecord,
  path3: pathRecord,
  path4: pathRecord,
  path5: pathRecord,
  path6: pathRecord,
  path7: pathRecord,
  deviceAddress: {
    type: String,
  },
  deviceOwner: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  deviceManager: {
    type: Schema.Types.ObjectId,
    ref: "profile",
  },
  deviceFollower: {
    type: Schema.Types.ObjectId,
    ref: "arrayId",
  },
  firstCreated: actionRecord,
  lastModified: actionRecord,
});

deviceSchema.pre("validate", async function (next) {
  logi(TAG, "validate", "createNewDevice");
  if (this.isNew) {
    const ArrayId = mongoose.model("arrayId");
    try {
      // Create and save arrayId documents based on role
      const deviceFollower = await new ArrayId().save();
      this.deviceFollower = deviceFollower._id;

      // Initialize path records if they are not already initialized
      this.path0 = this.path0 || {};
      this.path1 = this.path1 || {};
      this.path2 = this.path2 || {};
      this.path3 = this.path3 || {};
      this.path4 = this.path4 || {};
      this.path5 = this.path5 || {};
      this.path6 = this.path6 || {};
      this.path7 = this.path7 || {};

      this.path0.pathName = "path0";
      this.path1.pathName = "path1";
      this.path2.pathName = "path2";
      this.path3.pathName = "path3";
      this.path4.pathName = "path4";
      this.path5.pathName = "path5";
      this.path6.pathName = "path6";
      this.path7.pathName = "path7";
    } catch (error) {
      return next(error);
    }
  }
  next();
});

deviceSchema.statics.findBySerial = async function (deviceSerial) {
  let result = await this.findOne({ serial: deviceSerial });
  if (!result) {
    throw new Exception(
      Exception.DEVICE_NOT_FOUND_SERIAL,
      TAG,
      "findBySerial",
      HTTPCode.BAD_REQUEST
    );
  }
  return result;
};

// Sử dụng hàm chung trong các hàm cụ thể
deviceSchema.statics.findWithId = async function (id) {
  let result = await this.findById(id);
  if (!result) {
    throw new Exception(
      Exception.DEVICE_NOT_FOUND_ID,
      TAG,
      "findWithId",
      HTTPCode.BAD_REQUEST
    );
  }
  return result;
};

deviceSchema.statics.checkDeviceExist = async function (deviceSerial) {
  let result = await this.findOne({ serial: deviceSerial });
  if (result) {
    throw new Exception(
      Exception.DEVICE_EXIST,
      TAG,
      "checkDeviceExist",
      HTTPCode.BAD_REQUEST
    );
  }
};

// Create and export the model
export default mongoose.model("device", deviceSchema);
