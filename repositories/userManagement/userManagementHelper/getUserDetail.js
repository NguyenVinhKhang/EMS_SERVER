import { handleException } from "../../../exception/Exception.js";
import { logi } from "../../../helpers/log.js";
import { Account, Profile } from "../../../models/index.js";
import { getShortProfile } from "../../profileManagement/profileHelper.js";

const TAG = "GET USER DETAIL";

const getSubAccount = async ({ accountId }) => {
  try {
    logi(TAG, "getSubAccount", accountId);
    const subAccount = await Account.findWithId(accountId);
    let { password, ...returnAccount } = subAccount._doc;
    if (subAccount.lastModified) {
      returnAccount.lastModified = await getShortProfile(
        subAccount.lastModified.editedBy,
        subAccount.lastModified.editedTime
      );
    }
    if (subAccount.firstCreated) {
      returnAccount.firstCreated = await getShortProfile(
        subAccount.firstCreated.editedBy,
        subAccount.firstCreated.editedTime
      );
    }

    return returnAccount;
  } catch (exception) {
    await handleException(exception, TAG, "getSubAccount");
  }
};

const getSubProfile = async ({ profileId }) => {
  try {
    logi(TAG, "getSubProfile", profileId);
    const subProfile = await Profile.findWithId(profileId);
    let { ...returnProfile } = subProfile._doc;
    if (subProfile.lastModified) {
      returnProfile.lastModified = await getShortProfile(
        subProfile.lastModified.editedBy,
        subProfile.lastModified.editedTime
      );
    }
    return returnProfile;
  } catch (exception) {
    await handleException(exception, TAG, "getSubProfile");
  }
};
export default {
  getSubAccount,
  getSubProfile,
};
