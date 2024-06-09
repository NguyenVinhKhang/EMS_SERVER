import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";
import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";

const TAG = "REQUEST POOL MODEL";
// Define the schema
const requestPoolSchema = new Schema({
  serial: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => value.length === 12,
      message: "Device Serial must be 12 characters",
    },
  },
  status: {
    type: String,
    enum: ["pending", "accept", "denied"],
    required: true,
  },
  firstCreated: actionRecord,
});

// Static method to create a new request
requestPoolSchema.statics.createNewRequest = async function (
  creatorId,
  deviceSerial
) {
  const existingRequest = await this.findOne({
    serial: deviceSerial,
    "firstCreated.editedBy": creatorId,
  });
  if (existingRequest) {
    throw new Exception(
      Exception.DEVICE_REQUEST_ALREADY_EXIST,
      TAG,
      "createNewRequest",
      HTTPCode.BAD_REQUEST
    );
  }

  const newRequest = new this({
    serial: deviceSerial,
    status: "pending",
    firstCreated: { editedBy: creatorId },
  });
  await newRequest.save();

  return "Create request successfully";
};

// Create and export the model
export default mongoose.model("requestPool", requestPoolSchema);
