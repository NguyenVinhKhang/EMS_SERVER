import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";

export default mongoose.model(
  "account",
  new Schema({
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
  })
);
