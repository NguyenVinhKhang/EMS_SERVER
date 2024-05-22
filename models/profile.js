import mongoose, { Schema } from "mongoose";
import { actionRecord } from "./actionRecord.js";
import isEmail from "validator/lib/isEmail.js";
import { ArrayId } from "./index.js";

export default mongoose.model(
  "profile",
  new Schema({
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
  })
);
