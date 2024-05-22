import { ObjectId } from "mongodb";
import Exception from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { Profile } from "../../models/index.js";
import { getShortProfile } from "../../helpers/getShortProfile.js";
const TAG = "ProfileRepository";

const putEditProfile = async ({ id, name, email, address }) => {
  try {
    logi(TAG, "putEditProfile", { name, email, address });
    let objId = ObjectId(id);
    let profileData = await Profile.findOne({ _id: objId }).exec();

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
      let lastModifiedProfile = await Profile.findById(
        profileData.lastModified.editedBy
      );
      returnProfile.lastModified = {
        name: lastModifiedProfile.name,
        role: lastModifiedProfile.role,
        date: profileData.lastModified.editedTime,
      };
    }
    return returnProfile;
  } catch (exception) {
    throw new Exception(exception, TAG, "putEditProfile", HTTPCode.INSERT_FAIL);
  }
};

const getProfileData = async ({ id }) => {
  logi(TAG, "getProfileData", `${id}`);
  try {
    var objId = ObjectId(id);
    const profileData = await Profile.findOne({ _id: objId }).exec();
    logi(TAG, "profileData", profileData);
    if (!profileData) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        HTTPCode.BAD_REQUEST,
        "getProfileData"
      );
    }

    let returnProfile = { ...profileData._doc };
    returnProfile.lastModified = await getShortProfile(
      profileData.lastModified.editedBy,
      profileData.lastModified.editedTime
    );
    return returnProfile;
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        HTTPCode.BAD_REQUEST,
        "getProfileData"
      );
    }
  }
};

export default {
  putEditProfile,
  getProfileData,
};
