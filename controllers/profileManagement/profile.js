import { ProfileRepository } from "../../repositories/index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi } from "../../helpers/log.js";
import { tokenMap } from "../../authentication/tokenMap.js";

const TAG = "ProfileController";

const putEditProfile = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const id = await accountJWT?.profileId?.toString();
    const { name, email, address } = req.body;
    logi(TAG, "putEditProfile", { name, email, address });
    const user = await ProfileRepository.putEditProfile({
      id,
      name,
      email,
      address,
    });
    res.status(HTTPCode.INSERT_OK).json({
      message: "Update user's data successfully",
      data: user,
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

const getProfileData = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    logi(TAG, "getProfileData", accountJWT);
    const id = accountJWT?.profileId?.toString();
    const profileData = await ProfileRepository.getProfileData({ id });
    res.status(HTTPCode.OK).json({
      message: "Get data successfully",
      data: profileData,
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
  putEditProfile,
  getProfileData,
};
