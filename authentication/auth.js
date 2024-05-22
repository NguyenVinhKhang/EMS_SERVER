import HTTPCode from "../exception/HTTPStatusCode.js";
import jwt from "jsonwebtoken";
import { loge, logi } from "../helpers/log.js";
import { guestURL } from "../routes/routerConstant.js";
import { tokenMap } from "./tokenMap.js";

const TAG = "Authentication";
export async function checkToken(req, res, next) {
  logi(TAG, "checkToken", "Start check token");
  let keyUrl = req.url.toLowerCase().trim();
  if (guestURL[keyUrl]) {
    next();
    return;
  }
  try {
    const token = req.headers?.authorization.split(" ")[1];
    const { iat, exp, ...jwtObject } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    const user = await tokenMap.get(token);
    if (
      !user ||
      Object.keys(user).length === 0 ||
      JSON.stringify(jwtObject) !== JSON.stringify(user)
    ) {
      return res.status(HTTPCode.BAD_REQUEST).json({
        message: "Token is expired",
      });
    }
    req.token = token;
    logi(TAG, "checkToken", "End check token");
    next();
  } catch (exception) {
    loge(TAG, "checkToken", exception);
    res.status(HTTPCode.BAD_REQUEST).json({
      message: "Token is expired:" + exception.message,
    });
  }
}
