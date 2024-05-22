import { ObjectId } from "mongodb";
import Exception from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { Profile } from "../../models/index.js";
import { getShortProfile } from "./profileHelper.js";
const TAG = "ProfileRepository";

const putEditProfile = async ({ id, name, email, address }) => {
  try {
    logi(TAG, "putEditProfile", { name, email, address });
    let objId = ObjectId(id);
    let profileData = await Profile.findWithId(objId).exec();

    let isModified = false;
    if (name !== undefined && profileData.name !== name) {
      profileData.name = name;
      isModified = true;
    }
    if (email !== undefined && profileData.email !== email) {
      profileData.email = email;
      isModified = true;
    }
    if (address !== undefined && profileData.address !== address) {
      profileData.address = address;
      isModified = true;
    }

    if (isModified) {
      profileData.lastModified = {
        editedBy: profileData._id,
      };
    }

    await profileData.save();

    let returnProfile = { ...profileData._doc };
    if (profileData.lastModified) {
      returnProfile.lastModified = await getShortProfile(
        profileData.lastModified.editedBy,
        profileData.lastModified.editedTime
      );
    }
    return returnProfile;
  } catch (exception) {
    await handleException(exception, TAG, "putEditProfile");
  }
};

const getProfileData = async ({ id }) => {
  logi(TAG, "getProfileData", `${id}`);
  try {
    var objId = ObjectId(id);
    const profileData = await Profile.findWithId(objId).exec();
    let returnProfile = { ...profileData._doc };
    returnProfile.lastModified = await getShortProfile(
      profileData.lastModified.editedBy,
      profileData.lastModified.editedTime
    );
    return returnProfile;
  } catch (exception) {
    await handleException(exception, TAG, "getProfileData");
  }
};

export default {
  putEditProfile,
  getProfileData,
};
