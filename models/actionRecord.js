import mongoose, { Schema } from "mongoose";

export const actionRecord = new Schema({
  editedBy: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  editedTime: {
    type: Date,
    default: () => new Date(new Date().getTime() + 7 * 60 * 60 * 1000), // Thêm 7 giờ vào thời gian mặc định
    required: true,
  },
});

actionRecord.pre("save", function (next) {
  // Cập nhật thời gian
  this.editedTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // Thêm 7 giờ vào thời gian mặc định
  next();
});
