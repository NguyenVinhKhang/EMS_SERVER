import Exception from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { Profile } from "../../models/index.js";

async function getShortProfile(profileId, editedTime) {
  try {
    const shortProfile = await Profile.findWithId(profileId);
    let returnProfile = {
      name: shortProfile.name,
      role: shortProfile.role,
    };
    if (editedTime) {
      returnProfile.date = editedTime;
    }
    return returnProfile;
  } catch (exception) {
    await handleException(exception, "GET SHORT PROFILE", "getShortProfile");
  }
}

export { getShortProfile };
