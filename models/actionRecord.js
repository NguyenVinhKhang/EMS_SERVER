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
  // Bỏ qua middleware nếu không phải là việc tạo mới tài liệu
  if (!this.isNew) {
    return next();
  }
  // Cập nhật thời gian chỉ khi tài liệu mới được tạo
  this.editedTime = new Date(new Date().getTime() + 7 * 60 * 60 * 1000); // Thêm 7 giờ vào thời gian mặc định
  next();
});
