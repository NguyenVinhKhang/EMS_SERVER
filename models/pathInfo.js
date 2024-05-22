import mongoose, { Schema } from "mongoose";

export const pathRecord = new Schema({
  pathName: {
    type: String,
    required: true,
  },
  pathId: {
    type: Schema.Types.ObjectId,
  },
});
