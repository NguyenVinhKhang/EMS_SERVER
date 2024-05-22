import mongoose, { Schema } from "mongoose";
export default mongoose.model(
  "arrayId",
  new Schema({
    ids: [{ type: Schema.Types.ObjectId }],
  })
);
