import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";
import { Profile } from "../models/index.js";

async function getShortProfile(profileId, editedTime) {
  try {
    const shortProfile = await Profile.findById(profileId);
    if (!shortProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        "SHORT_PROFILE",
        "getShortProfile"
      );
    }
    return {
      name: shortProfile.name,
      role: shortProfile.role,
      date: editedTime,
    };
  } catch (exception) {
    throw new Exception(
      exception,
      "GET_SHORT_PROFILE",
      "getShortProfile",
      HTTPCode.INTERNAL_SERVER_ERROR
    );
  }
}

export { getShortProfile };
