import mongoose from "mongoose";

const tmpLoginSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Object,
    required: true,
  },
});

const tmpLogin = mongoose.model("tmpLogin", tmpLoginSchema);

export default tmpLogin;
