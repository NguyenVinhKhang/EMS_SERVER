import mongoose from "mongoose";
import { loge, logs } from "../helpers/log.js";
import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";
const TAG = "DATABASE";

mongoose.set(`strictQuery`, true);
async function connect() {
  try {
    let connection = await mongoose.connect(process.env.MONGODB_URI);
    logs(TAG, "Connect database successfully");
    return connection;
  } catch (error) {
    const { code } = error;
    loge(TAG, "connect", error);
    if (code === 8000) {
      throw new Exception(
        Exception.DB_WRONG_USERNAME_PASSWORD,
        TAG,
        "connect",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    } else if (code === "ENOTFOUND") {
      throw new Exception(
        Exception.DB_WRONG_CONNECTION_STRING,
        TAG,
        "connect",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
    throw new Exception(
      Exception.DB_CANNOT_CONNECT_MONGODB,
      TAG,
      "connect",
      HTTPCode.INTERNAL_SERVER_ERROR
    );
  }
}

export default connect;
