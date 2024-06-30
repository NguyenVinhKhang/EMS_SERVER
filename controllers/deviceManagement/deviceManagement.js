import { DeviceManagement } from "../../repositories/index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { loge, logi } from "../../helpers/log.js";
import { tokenMap } from "../../authentication/tokenMap.js";

const TAG = "DeviceController";

const postCreateNewDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const {
      serial,
      deviceName,
      deviceAddress,
      deviceOwnerId,
      deviceManagerId,
    } = req.body;
    logi(TAG, "postCreateNewDevice", {
      serial,
      deviceName,
      deviceAddress,
      deviceOwnerId,
      deviceManagerId,
    });
    const devices = await DeviceManagement.postCreateNewDevice({
      creatorProfileId: accountJWT.profileId,
      deviceSerial: serial,
      deviceName,
      deviceAddress,
      deviceOwnerId,
      deviceManagerId,
    });
    res.status(HTTPCode.OK).json({
      message: "Create new devices successfully",
      data: devices,
    });
  } catch (exception) {
    loge(TAG, "CREATE NEW DEVICE", exception);
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

const getListAllDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { searchString, page, size } = req.body;
    logi(TAG, "getListAllDevice", { searchString, page, size });
    const devices = await DeviceManagement.getListAllDevice({
      accountJWT,
      searchString,
      page,
      size,
    });
    res.status(HTTPCode.OK).json({
      message: "Get list of all devices successfully",
      data: devices,
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

const getOwnListDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { searchString, page, size } = req.body;
    logi(TAG, "getOwnListDevice", { searchString, page, size });
    const devices = await DeviceManagement.getOwnListDevice({
      accountJWT,
      searchString,
      page,
      size,
    });
    res.status(HTTPCode.OK).json({
      message: "Get user's list of devices successfully",
      data: devices,
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

const getListDeviceManageById = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { searchString, page, size, profileId } = req.body;
    logi(TAG, "getListDeviceManageById", {
      searchString,
      page,
      size,
      profileId,
    });
    const devices = await DeviceManagement.getListDeviceManageById({
      accountJWT,
      searchString,
      page,
      size,
      profileId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get list of devices managed by profile successfully",
      data: devices,
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

const getListDeviceFollowingById = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { searchString, page, size, profileId } = req.body;
    logi(TAG, "getListDeviceFollowingById", {
      searchString,
      page,
      size,
      profileId,
    });
    const devices = await DeviceManagement.getListDeviceFollowingById({
      accountJWT,
      searchString,
      page,
      size,
      profileId,
    });
    res.status(HTTPCode.OK).json({
      message: "Get list of devices following successfully",
      data: devices,
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

const getDeviceDetail = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    logi(TAG, "getDeviceDetail", { deviceSerial: serial });
    const device = await DeviceManagement.getDeviceDetail({
      accountJWT,
      deviceSerial: serial,
    });
    res.status(HTTPCode.OK).json({
      message: "Get device detail successfully",
      data: device,
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

const getListDeviceFollower = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { searchString, page, size } = req.body;
    logi(TAG, "getListDeviceFollower", { deviceSerial: serial });
    const device = await DeviceManagement.getListDeviceFollower({
      accountJWT,
      deviceSerial: serial,
      searchString,
      page,
      size,
    });
    res.status(HTTPCode.OK).json({
      message: "Get device list follower successfully",
      data: device,
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

const putEditDeviceDetail = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { deviceName, deviceAddress } = req.body;
    logi(TAG, "getDeviceDetail", { deviceSerial: serial });
    const device = await DeviceManagement.putEditDeviceDetail({
      accountJWT,
      deviceSerial: serial,
      deviceName,
      deviceAddress,
    });
    res.status(HTTPCode.OK).json({
      message: "Edit device's detail successfully",
      data: device,
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

const putChangeDeviceOwner = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { newOwnerId } = req.body;
    logi(TAG, "putChangeDeviceOwner", {
      accountJWT,
      newOwnerId,
      deviceSerial: serial,
    });
    const device = await DeviceManagement.putChangeDeviceOwner({
      accountJWT,
      newOwnerId,
      deviceSerial: serial,
    });
    res.status(HTTPCode.OK).json({
      message: "Edit device's owner successfully",
      data: device,
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

const putChangeDeviceManager = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { newManagerId } = req.body;
    logi(TAG, "putChangeDeviceManager", {
      accountJWT,
      newManagerId,
      deviceSerial: serial,
    });
    const device = await DeviceManagement.putChangeDeviceManager({
      accountJWT,
      newManagerId,
      deviceSerial: serial,
    });
    res.status(HTTPCode.OK).json({
      message: "Edit device's manager successfully",
      data: device,
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

const putEditDevicePath = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { path0, path1, path2, path3, path4, path5, path6, path7 } = req.body;
    logi(TAG, "putEditDevicePath", {
      deviceSerial: serial,
      path0,
      path1,
      path2,
      path3,
      path4,
      path5,
      path6,
      path7,
    });
    const device = await DeviceManagement.putEditDevicePath({
      accountJWT,
      deviceSerial: serial,
      path0,
      path1,
      path2,
      path3,
      path4,
      path5,
      path6,
      path7,
    });
    res.status(HTTPCode.OK).json({
      message: "Edit device's paths successfully",
      data: device,
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

const putAddCustomerToDeviceFlowerList = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { listNewFollowerId } = req.body;
    logi(TAG, "putAddCustomerToDeviceFlowerList", { serial });
    const device = await DeviceManagement.putAddCustomerToDeviceFlowerList({
      accountJWT,
      deviceSerial: serial,
      listNewFollowerId,
    });
    res.status(HTTPCode.OK).json({
      message: "Edit device's detail successfully",
      data: device,
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

const putRemoveCustomerFromDeviceFollowerList = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.params;
    const { listRemoveFollowerId } = req.body;
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      serial,
      listRemoveFollowerId,
    });
    const device =
      await DeviceManagement.putRemoveCustomerFromDeviceFollowerList({
        accountJWT,
        deviceSerial: serial,
        listRemoveFollowerId,
      });
    res.status(HTTPCode.OK).json({
      message: "Edit device's detail successfully",
      data: device,
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

const getListRequestMake = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { page, size, status, searchString } = req.body;
    logi(TAG, "getListRequestMake", {
      page,
      size,
      status,
      searchString,
    });
    const listRequest = await DeviceManagement.getListRequestMake({
      accountJWT,
      page,
      size,
      status,
      searchString,
    });
    res.status(HTTPCode.OK).json({
      message: "Get list request successfully",
      data: listRequest,
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

const getListRequestToDevice = async (req, res) => {
  try {
    let token = req?.token;
    const { serial } = req.params;
    let accountJWT = await tokenMap.get(token);
    const { page, size, status } = req.body;
    logi(TAG, "getListRequestToDevice", {
      accountJWT,
      deviceSerial: serial,
      page,
      size,
      status,
    });
    const listRequest = await DeviceManagement.getListRequestToDevice({
      accountJWT,
      deviceSerial: serial,
      page,
      size,
      status,
    });
    res.status(HTTPCode.OK).json({
      message: "Get list request successfully",
      data: listRequest,
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

const putResponseRequestToDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { requestPoolId, status } = req.body;
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      requestPoolId,
      status,
    });
    const device = await DeviceManagement.putResponseRequestToDevice({
      accountJWT,
      requestPoolId,
      status,
    });
    res.status(HTTPCode.OK).json({
      message: "  Response successfully",
      data: device,
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

const postCreateRequestFollowDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.body;
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      deviceSerial: serial,
      accountJWT,
    });
    const device = await DeviceManagement.postCreateRequestFollowDevice({
      accountJWT,
      deviceSerial: serial,
    });
    res.status(HTTPCode.OK).json({
      message: device,
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

const putRemoveRequestFollowDevice = async (req, res) => {
  try {
    let token = req?.token;
    let accountJWT = await tokenMap.get(token);
    const { serial } = req.body;
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      deviceSerial: serial,
      accountJWT,
    });
    const result = await DeviceManagement.putRemoveRequestFollowDevice({
      editorId: accountJWT.profileId,
      deviceSerial: serial,
    });
    res.status(HTTPCode.OK).json({
      message: result,
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
  postCreateNewDevice,
  getListAllDevice,
  getListDeviceManageById,
  getListDeviceFollowingById,
  getDeviceDetail,
  getListDeviceFollower,
  getOwnListDevice,
  putEditDeviceDetail,
  putChangeDeviceOwner,
  putEditDevicePath,
  putChangeDeviceManager,
  putAddCustomerToDeviceFlowerList,
  putRemoveCustomerFromDeviceFollowerList,
  getListRequestMake,
  getListRequestToDevice,
  putResponseRequestToDevice,
  postCreateRequestFollowDevice,
  putRemoveRequestFollowDevice,
};
