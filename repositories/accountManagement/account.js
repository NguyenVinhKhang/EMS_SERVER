import { tokenMap } from "../../authentication/tokenMap.js";
import Exception, { handleException } from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { Account, ArrayId, Profile } from "../../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TAG = "accountManagementRepository";

const login = async ({ phoneNumber, passwordInput }) => {
  try {
    let account = await Account.findByPhoneNumber({ phoneNumber });
    logi(TAG, "Login", account);
    let isMatch = await bcrypt.compare(passwordInput, account.password);
    if (!isMatch) {
      throw new Exception(
        Exception.ACCOUNT_PASSWORD_INVALID,
        TAG,
        "login",
        HTTPCode.BAD_REQUEST
      );
    }
    const { password, firstCreated, lastModified, ...returnAccount } =
      account._doc;
    const token = jwt.sign(returnAccount, process.env.JWT_SECRET, {
      expiresIn: "1 day",
    });

    tokenMap.add(token, returnAccount);
    return {
      account: returnAccount,
      token: token,
    };
  } catch (exception) {
    await handleException(exception, TAG, "login");
  }
};

const logout = async ({ token }) => {
  try {
    tokenMap.remove(token);
    return "Logout successfully";
  } catch (exception) {
    await handleException(exception, TAG, "logout");
  }
};

const register = async ({ password, phoneNumber, staffPhoneNumber, name }) => {
  logi(TAG, `register`, { password, phoneNumber, staffPhoneNumber, name });
  try {
    await Account.checkPhoneNumberNotExist({ phoneNumber }).exec();
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const newCustomerProfile = await Profile.create({
      name: name,
      phoneNumber: phoneNumber,
      role: "customer",
      address: "",
      email: "",
    });
    await newCustomerProfile.save();
    const newAccount = await Account.create({
      phoneNumber,
      password: hashPassword,
      role: "customer",
      profileId: newCustomerProfile._id,
    });

    newAccount.lastModified = {
      editedBy: newCustomerProfile._id,
    };
    newAccount.firstCreated = {
      editedBy: newCustomerProfile._id,
    };
    await newAccount.save();

    const customerListSuper = new ArrayId({
      ids: [],
    });
    await customerListSuper.save();
    newCustomerProfile.listSuperProfile = customerListSuper._id;
    newCustomerProfile.accountId = newAccount._id;
    newCustomerProfile.lastModified = {
      editedBy: newCustomerProfile._id,
    };
    let staff;
    await newCustomerProfile.save();
    if (staffPhoneNumber && staffPhoneNumber !== "") {
      staff = await Profile.findByPhoneNumber({
        phoneNumber: staffPhoneNumber,
      }).exec();

      let staffListSub = await ArrayId.findById({
        _id: staff.listSubProfile,
      }).exec();
      staffListSub.ids.push(newCustomerProfile._id);
      await staffListSub.save();
      let customerListSup = await ArrayId.findById({
        _id: newCustomerProfile.listSuperProfile,
      }).exec();
      customerListSup.ids.push(staff._id);
      await customerListSup.save();
    }
    await newCustomerProfile.save();
    logi(TAG, `register`, "Registration successful");
    return "Registration successful";
  } catch (exception) {
    await handleException(exception, TAG, "register");
  }
};

const putChangeAccountPassword = async ({
  accountJWT,
  oldPassword,
  newPassword1,
  newPassword2,
  token,
}) => {
  try {
    logi(TAG, "putChangeAccountPassword", {
      oldPassword,
      newPassword1,
      newPassword2,
    });
    const account = await Account.findWithId(accountJWT._id);
    if (await bcrypt.compare(oldPassword, account.password)) {
      if (newPassword1 === newPassword2) {
        const hashPassword = await bcrypt.hash(
          newPassword1,
          parseInt(process.env.SALT_ROUNDS)
        );
        account.password = hashPassword;
        const existingProfile = await Profile.findWithId(
          accountJWT.profileId
        ).exec();
        account.lastModified = {
          editedBy: existingProfile._id,
        };
        await account.save();
        tokenMap.remove(token);
        logi(TAG, "putChangeAccountPassword:", account);
      } else {
        throw new Exception(
          Exception.ACCOUNT_NEW_PASSWORD_NOT_MATCH,
          TAG,
          "putChangeAccountPassword",
          HTTPCode.INSERT_FAIL
        );
      }
    } else {
      throw new Exception(
        Exception.ACCOUNT_OLD_PASSWORD_INCORRECT,
        TAG,
        "putChangeAccountPassword",
        HTTPCode.INSERT_FAIL
      );
    }
    return "Change password successfully";
  } catch (exception) {
    await handleException(exception, TAG, "putChangeAccountPassword");
  }
};

const putChangeAccountPhoneNumber = async ({
  accountJWT,
  password,
  newPhoneNumber1,
  newPhoneNumber2,
  token,
}) => {
  try {
    logi(TAG, "putChangeAccountPhoneNumber", {
      password,
      newPhoneNumber1,
      newPhoneNumber2,
    });
    const account = await Account.findWithId(accountJWT._id);
    if (await bcrypt.compare(password, account.password)) {
      if ((newPhoneNumber1 = newPhoneNumber2)) {
        await Account.checkPhoneNumberNotExist({
          phoneNumber: newPhoneNumber1,
        });
        account.phoneNumber = newPhoneNumber1;
        const existingProfile = await Profile.findWithId(
          accountJWT.profileId
        ).exec();
        account.lastModified = {
          editedBy: existingProfile._id,
        };
        await account.save();
        existingProfile.phoneNumber = newPhoneNumber1;
        existingProfile.lastModified = {
          editedBy: existingProfile._id,
        };
        await existingProfile.save();
        tokenMap.remove(token);
        logi(TAG, "putChangeAccountPassword:", account);
      } else {
        throw new Exception(
          Exception.ACCOUNT_NEW_PHONE_NUMBER_NOT_MATCH,
          TAG,
          HTTPCode.INSERT_FAIL
        );
      }
    } else {
      throw new Exception(
        Exception.ACCOUNT_OLD_PASSWORD_INCORRECT,
        TAG,
        "putChangeAccountPhoneNumber",
        HTTPCode.INSERT_FAIL
      );
    }
    return "Change phone number successfully";
  } catch (exception) {
    await handleException(exception, TAG, "putChangeAccountPhoneNumber");
  }
};

export default {
  login,
  logout,
  register,
  putChangeAccountPassword,
  putChangeAccountPhoneNumber,
};
