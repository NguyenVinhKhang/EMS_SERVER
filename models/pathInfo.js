import mongoose, { Schema } from "mongoose";

export const pathRecord = new Schema({
  pathName: {
    type: String,
    default: ""
  },
  pathId: {
    type: Schema.Types.ObjectId,
  },
});
