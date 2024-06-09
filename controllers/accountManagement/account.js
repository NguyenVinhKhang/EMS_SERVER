import { validationResult } from "express-validator";
import { AccountRepository } from "../../repositories/index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { tokenMap } from "../../authentication/tokenMap.js";

const TAG = "accountManagementController";

const checkSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTPCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  try {
    logi(TAG, "checkSession", "Start");
    res.status(HTTPCode.OK).json({ message: "Token is valid" });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message ? exception.message : exception,
      });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTPCode.BAD_REQUEST).json({ errors: errors.array() });
  }
  const { phoneNumber, password } = req.body;
  try {
    logi(TAG, "Login", { phoneNumber: phoneNumber, password: password });
    let account = await AccountRepository.login({
      phoneNumber,
      passwordInput: password,
    });
    res
      .status(HTTPCode.OK)
      .json({ message: "Login users Successfully", data: account });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message ? exception.message : exception,
      });
  }
};

const register = async (req, res) => {
  const { password, phoneNumber, staffPhoneNumber, name } = req.body;
  try {
    logi(TAG, "Register", { password, phoneNumber, staffPhoneNumber, name });
    await AccountRepository.register({
      password,
      phoneNumber,
      staffPhoneNumber,
      name,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Registration successful",
    });
  } catch (exception) {
    res.status(exception.statusCode).json({
      message: exception.message ? exception.message : exception,
    });
  }
};

const logout = async (req, res) => {
  let token = req?.token;
  try {
    logi(TAG, "Logout", {});
    const message = await AccountRepository.logout({
      token,
    });
    res.status(HTTPCode.OK).json({
      message: message,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message ? exception.message : exception,
      });
  }
};

const putChangeAccountPassword = async (req, res) => {
  let token = req?.token;
  let accountJWT = await tokenMap.get(token);
  const { oldPassword, newPassword1, newPassword2 } = req.body;
  try {
    logi(TAG, "putChangeAccountPassword", {
      oldPassword,
      newPassword1,
      newPassword2,
    });
    const message = await AccountRepository.putChangeAccountPassword({
      accountJWT,
      oldPassword,
      newPassword1,
      newPassword2,
      token,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: message,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message ? exception.message : exception,
      });
  }
};

const putChangeAccountPhoneNumber = async (req, res) => {
  let token = req?.token;
  let accountJWT = await tokenMap.get(token);

  const { password, newPhoneNumber1, newPhoneNumber2 } = req.body;
  try {
    logi(TAG, "putChangeAccountPhoneNumber", {
      password,
      newPhoneNumber1,
      newPhoneNumber2,
      accountJWT,
      token,
    });
    const message = await AccountRepository.putChangeAccountPhoneNumber({
      accountJWT,
      password,
      newPhoneNumber1,
      newPhoneNumber2,
      token,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: message,
    });
  } catch (exception) {
    res
      .status(
        exception.statusCode
          ? exception.statusCode
          : HTTPCode.INTERNAL_SERVER_ERROR
      )
      .json({
        message: exception.message ? exception.message : exception,
      });
  }
};

export default {
  checkSession,
  login,
  logout,
  register,
  putChangeAccountPassword,
  putChangeAccountPhoneNumber,
};
