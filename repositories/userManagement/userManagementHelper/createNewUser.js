import { logi } from "../../../helpers/log.js";
import bcrypt from "bcrypt";
import { Account, Profile, ArrayId } from "../../../models/index.js";
import { getShortProfile } from "../../profileManagement/profileHelper.js";
import { handleException } from "../../../exception/Exception.js";

const TAG = "CREATE NEW USER";
const postCreateNewUser = async ({
  accountJWT,
  password,
  phoneNumber,
  name,
  role,
}) => {
  try {
    logi(TAG, "postCreateNewUser", {
      accountJWT,
      password,
      phoneNumber,
      name,
      role,
    });
    await Account.checkPhoneNumberNotExist({
      phoneNumber,
    });
    const hashPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS)
    );
    const creatorProfile = await Profile.findWithId(accountJWT.profileId);

    const newAccount = new Account({
      phoneNumber: phoneNumber,
      password: hashPassword,
      role: role,
      firstCreated: {
        editedBy: creatorProfile._id,
      },
      lastModified: {
        editedBy: creatorProfile._id,
      },
    });

    const newProfile = new Profile({
      name: name,
      phoneNumber: phoneNumber,
      role: role,
      address: "",
      email: "",
      lastModified: {
        editedBy: creatorProfile._id,
      },
    });

    // Lưu newAccount và newProfile để lấy _id cho các bước tiếp theo
    await newAccount.save();
    await newProfile.save();

    newAccount.profileId = newProfile._id;
    newProfile.accountId = newAccount._id;

    await newAccount.save();
    await newProfile.save();

    if (
      (role === "customer" && accountJWT.role === "staff") ||
      (role === "staff" && accountJWT.role === "admin")
    ) {
      let listSuperId = await ArrayId.findById(newProfile.listSuperProfile);
      listSuperId.ids.push(accountJWT.profileId);
      await listSuperId.save();

      let listSubId = await ArrayId.findById(creatorProfile.listSubProfile);
      listSubId.ids.push(newProfile._id);
      await listSubId.save();
    }

    const returnAccount = { ...newAccount._doc };
    delete returnAccount.password;

    if (newAccount.lastModified) {
      returnAccount.lastModified = await getShortProfile(
        newAccount.lastModified.editedBy,
        newAccount.lastModified.editedTime
      );
    }

    if (newAccount.firstCreated) {
      returnAccount.firstCreated = await getShortProfile(
        newAccount.firstCreated.editedBy,
        newAccount.firstCreated.editedTime
      );
    }

    return returnAccount;
  } catch (exception) {
    await handleException(exception, TAG, "postCreateNewUser");
  }
};

export default {
  postCreateNewUser,
};
