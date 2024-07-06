import Exception, { handleException } from "../../exception/Exception.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import {
  checkAdminRight,
  checkCustomerRight,
  checkStaffRight,
} from "../../global/authorization.js";
import { logi, logw } from "../../helpers/log.js";
import { ArrayId, Device, Profile, RequestPool } from "../../models/index.js";
import { ObjectId } from "mongodb";
import DeviceManagementHelper from "./deviceManagementHelper/index.js";

const TAG = "DeviceManagementRepository";

const getListAllDevice = async ({ accountJWT, searchString, page, size }) => {
  try {
    logi(TAG, "getListAllDevice", {
      accountJWT,
      searchString,
      page,
      size,
    });
    await checkAdminRight(accountJWT.role);
    let result = await DeviceManagementHelper.getListAllDevice({
      searchString,
      page,
      size,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListAllDevice");
  }
};

const getOwnListDevice = async ({ accountJWT, searchString, page, size }) => {
  try {
    logi(TAG, "getOwnListDevice", {
      accountJWT,
      searchString,
      page,
      size,
    });
    let result = await DeviceManagementHelper.getListDeviceManageById({
      searchString,
      page,
      size,
      profileId: accountJWT.profileId,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListAllDevice");
  }
};

const getListDeviceManageById = async ({
  accountJWT,
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getListDeviceManageById", {
      accountJWT,
      searchString,
      page,
      size,
      profileId,
    });
    await checkStaffRight(accountJWT.role);
    let result;
    if (accountJWT.role === "admin") {
      result = await DeviceManagementHelper.getListDeviceManageById({
        searchString,
        page,
        size,
        profileId,
      });
    } else {
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffListSub = await ArrayId.findById(staffProfile.listSubProfile);
      if (!staffListSub.ids.includes(profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getListDeviceManageById",
          HTTPCode.BAD_REQUEST
        );
      }
      result = await DeviceManagementHelper.getCustomerListManageDevice(
        accountJWT.profileId,
        searchString,
        page,
        size,
        profileId
      );
    }
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListDeviceManageById");
  }
};

const getListDeviceFollowingById = async ({
  accountJWT,
  searchString,
  page,
  size,
  profileId,
}) => {
  try {
    logi(TAG, "getListDeviceFollowingById", {
      accountJWT,
      searchString,
      page,
      size,
      profileId,
    });
    await checkCustomerRight(accountJWT.role);
    logw(TAG, "getListDeviceFollowingById", {
      data1: accountJWT.role,
      data2: ObjectId(profileId),
      data3: accountJWT.profileId,
      data4: accountJWT.role === "customer",
      data5: accountJWT.profileId === ObjectId(profileId),
    });
    let result;
    if (accountJWT.role === "admin") {
      result = await DeviceManagementHelper.getListDeviceFollowingById({
        searchString,
        page,
        size,
        profileId,
      });
    } else if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffListSub = await ArrayId.findById(staffProfile.listSubProfile);
      if (!staffListSub.ids.includes(profileId)) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "getListDeviceManageById",
          HTTPCode.BAD_REQUEST
        );
      }
      result = await DeviceManagementHelper.getCustomerListFollowingDevice({
        staffId: accountJWT.profileId,
        searchString,
        page,
        size,
        profileId,
      });
    } else if (accountJWT.role === "customer") {
      result = await DeviceManagementHelper.getListDeviceFollowingById({
        searchString,
        page,
        size,
        profileId: accountJWT.profileId,
      });
    }
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListDeviceFollowingById");
  }
};

const getDeviceDetail = async ({ accountJWT, deviceSerial }) => {
  try {
    logi(TAG, "getDeviceDetail", {
      deviceSerial,
    });
    let result;
    const deviceExist = await Device.findBySerial(deviceSerial);
    logw(TAG, "getDeviceDetail", deviceExist);
    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      logw(TAG, "getDeviceDetail", {
        owner: deviceExist.deviceOwner,
        request: accountJWT.profileId,
        test: !deviceExist.deviceOwner.equals(accountJWT.profileId),
      });
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "getDeviceDetail",
        HTTPCode.BAD_REQUEST
      );
    }
    result = await DeviceManagementHelper.getDeviceDetail({ deviceSerial });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getDeviceDetail");
  }
};

const getListDeviceFollower = async ({
  accountJWT,
  deviceSerial,
  searchString,
  page,
  size,
}) => {
  try {
    logi(TAG, "getListDeviceFollower", {
      deviceSerial,
    });
    await checkStaffRight(accountJWT.role);
    let result;
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "getListDeviceFollower",
        HTTPCode.BAD_REQUEST
      );
    }
    result = await DeviceManagementHelper.getListDeviceFollower({
      deviceSerial,
      searchString,
      page,
      size,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getDeviceListFollower");
  }
};

const putEditDeviceDetail = async ({
  accountJWT,
  deviceSerial,
  deviceName,
  deviceAddress,
}) => {
  try {
    logi(TAG, "putEditDeviceDetail", {
      deviceSerial,
    });
    let result;
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putEditDeviceDetail",
        HTTPCode.BAD_REQUEST
      );
    }
    result = await DeviceManagementHelper.putEditDeviceDetail({
      editorProfileId: accountJWT.profileId,
      deviceSerial,
      deviceName,
      deviceAddress,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getDeviceListFollower");
  }
};

const putEditDevicePath = async ({
  accountJWT,
  deviceSerial,
  path0,
  path1,
  path2,
  path3,
  path4,
  path5,
  path6,
  path7,
}) => {
  try {
    logi(TAG, "putEditDevicePath", {
      deviceSerial,
      path0,
      path1,
      path2,
      path3,
      path4,
      path5,
      path6,
      path7,
    });
    let result;
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putEditDevicePath",
        HTTPCode.BAD_REQUEST
      );
    }
    result = await DeviceManagementHelper.putEditDevicePath({
      editorProfileId: accountJWT.profileId,
      deviceSerial,
      path0,
      path1,
      path2,
      path3,
      path4,
      path5,
      path6,
      path7,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getDeviceListFollower");
  }
};

const putChangeDeviceOwner = async ({
  accountJWT,
  newOwnerId,
  deviceSerial,
}) => {
  try {
    logi(TAG, "putChangeDeviceOwner", {
      accountJWT,
      newOwnerId,
      deviceSerial,
    });
    await checkStaffRight(accountJWT.role);
    const deviceExist = await Device.findBySerial(deviceSerial);

    if (
      accountJWT.role === "staff" &&
      !deviceExist.deviceManager.equals(accountJWT.profileId)
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putChangeDeviceOwner",
        HTTPCode.BAD_REQUEST
      );
    }
    let customer = await Profile.findWithId(ObjectId(newOwnerId));
    if (customer.role !== "customer") {
      throw new Exception(
        Exception.PROFILE_CANNOT_FIND_ID + newOwnerId,
        TAG,
        "putChangeDeviceOwner",
        HTTPCode.BAD_REQUEST
      );
    }
    let result;
    if (accountJWT.role === "staff") {
      let staffProfile = await Profile.findWithId(accountJWT.profileId);
      let staffSubList = await ArrayId.findById(staffProfile.listSubProfile);
      if (!staffSubList.includes(ObjectId(newOwnerId))) {
        throw new Exception(
          Exception.ACCOUNT_ACCESS_DENIED,
          TAG,
          "putChangeDeviceOwner",
          HTTPCode.BAD_REQUEST
        );
      }
      result = await DeviceManagementHelper.putStaffChangeDeviceOwner({
        accountJWT,
        newOwnerId: ObjectId(newOwnerId),
        deviceSerial,
      });
    } else if (accountJWT.role === "admin") {
      result = await DeviceManagementHelper.putAdminChangeDeviceOwner({
        accountJWT,
        newOwnerId: ObjectId(newOwnerId),
        deviceSerial,
      });
    }
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "putChangeDeviceOwner");
  }
};

const putChangeDeviceManager = async ({
  accountJWT,
  newManagerId,
  deviceSerial,
}) => {
  try {
    logi(TAG, "putChangeDeviceManager", {
      accountJWT,
      newOwnerId: newManagerId,
      deviceSerial,
    });
    await checkStaffRight(accountJWT.role);
    let staff = await Profile.findWithId(ObjectId(newManagerId));
    if (staff.role !== "staff") {
      throw new Exception(
        Exception.PROFILE_CANNOT_FIND_ID + newManagerId,
        TAG,
        "putChangeDeviceManager",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await DeviceManagementHelper.putChangeDeviceManager({
      accountJWT,
      newManagerId: ObjectId(newManagerId),
      deviceSerial,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "putChangeDeviceManager");
  }
};

const putRemoveCustomerFromDeviceFollowerList = async ({
  accountJWT,
  deviceSerial,
  listRemoveFollowerId,
}) => {
  try {
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      editorProfileId: accountJWT.profileId,
      deviceSerial,
      listRemoveFollowerId,
    });
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putRemoveCustomerFromDeviceFollowerList",
        HTTPCode.BAD_REQUEST
      );
    }
    let result =
      await DeviceManagementHelper.putRemoveCustomerFromDeviceFollowerList({
        editorProfileId: accountJWT.profileId,
        deviceSerial: deviceSerial,
        listRemoveFollowerId: listRemoveFollowerId,
      });
    return result;
  } catch (exception) {
    await handleException(
      exception,
      TAG,
      "putRemoveCustomerFromDeviceFollowerList"
    );
  }
};

const putAddCustomerToDeviceFlowerList = async ({
  accountJWT,
  deviceSerial,
  listNewFollowerId,
}) => {
  try {
    logi(TAG, "putAddCustomerToDeviceFlowerList", {
      editorProfileId: accountJWT.profileId,
      deviceSerial,
      listNewFollowerId,
    });
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putRemoveCustomerFromDeviceFollowerList",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await DeviceManagementHelper.putAddCustomerToDeviceFlowerList({
      editorProfileId: accountJWT.profileId,
      deviceSerial: deviceSerial,
      listNewFollowerId: listNewFollowerId,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "putAddCustomerToDeviceFlowerList");
  }
};

const getListRequestMake = async ({
  accountJWT,
  page,
  size,
  status,
  searchString,
}) => {
  try {
    logi(TAG, "getListRequestMake", {
      page,
      size,
      status,
      searchString,
    });
    let result = await DeviceManagementHelper.getListRequestMake({
      profileId: accountJWT.profileId,
      page,
      size,
      status,
      searchString,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestMake");
  }
};

const getListRequestToDevice = async ({
  accountJWT,
  deviceSerial,
  page,
  size,
  status,
}) => {
  try {
    logi(TAG, "getListRequestToDevice", {
      deviceSerial,
      page,
      size,
      status,
    });
    const deviceExist = await Device.findBySerial(deviceSerial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff && !deviceExist.deviceManager.equals(accountJWT.profileId)) ||
      (isCustomer && !deviceExist.deviceOwner.equals(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "getListRequestToDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await DeviceManagementHelper.getListRequestToDevice({
      deviceSerial,
      page,
      size,
      status,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestToDevice");
  }
};

const putResponseRequestToDevice = async ({
  accountJWT,
  requestPoolId,
  status,
}) => {
  try {
    logi(TAG, "putResponseRequestToDevice", {
      accountJWT,
      requestPoolId,
      status,
    });
    let requestPool = await RequestPool.findById(requestPoolId);
    if (!requestPool) {
      throw new Exception(
        Exception.REQUEST_DOES_NOT_EXIST,
        TAG,
        "putResponseRequestToDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    const deviceExist = await Device.findBySerial(requestPool.serial);

    const isStaff = accountJWT.role === "staff";
    const isCustomer = accountJWT.role === "customer";

    if (
      (isStaff &&
        toString(deviceExist.deviceManager) !==
          toString(accountJWT.profileId)) ||
      (isCustomer &&
        toString(deviceExist.deviceOwner) !== toString(accountJWT.profileId))
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putResponseRequestToDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await DeviceManagementHelper.putResponseRequestToDevice({
      editorProfileId: accountJWT.profileId,
      requestPoolId,
      status,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestToDevice");
  }
};

const postCreateRequestFollowDevice = async ({ accountJWT, deviceSerial }) => {
  try {
    logi(TAG, "postCreateRequestFollowDevice", {
      accountJWT,
      deviceSerial,
    });
    const deviceExist = await Device.findBySerial(deviceSerial);

    if (
      accountJWT.role !== "customer" &&
      deviceExist.deviceOwner === accountJWT.profileId
    ) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "getListRequestToDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await DeviceManagementHelper.postCreateRequestFollowDevice({
      creatorId: accountJWT.profileId,
      deviceSerial,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestToDevice");
  }
};

const putRemoveRequestFollowDevice = async ({ editorId, deviceSerial }) => {
  try {
    logi(TAG, "putRemoveRequestFollowDevice", {
      editorId,
      deviceSerial,
    });
    let result = await DeviceManagementHelper.putRemoveRequestFollowDevice({
      editorId,
      deviceSerial,
    });
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestToDevice");
  }
};

const postCreateNewDevice = async ({
  creatorProfile,
  deviceSerial,
  deviceName,
  deviceAddress,
  deviceOwnerId,
  deviceManagerId,
}) => {
  try {
    logi(TAG, "postCreateNewDevice", {
      creatorProfile,
      deviceSerial,
      deviceName,
      deviceAddress,
      deviceOwnerId,
      deviceManagerId,
    });
    let result;
    if (creatorProfile.role === "customer") {
      result = await DeviceManagementHelper.postCreateNewDevice({
        creatorProfileId: creatorProfile.profileId,
        deviceSerial,
        deviceName,
        deviceAddress,
        deviceOwnerId: creatorProfile.profileId,
        deviceManagerId,
      });
    }
    if (creatorProfile.role === "staff") {
      result = await DeviceManagementHelper.postCreateNewDevice({
        creatorProfileId: creatorProfile.profileId,
        deviceSerial,
        deviceName,
        deviceAddress,
        deviceOwnerId,
        deviceManagerId: creatorProfile.profileId,
      });
    }
    if (creatorProfile.role === "admin") {
      result = await DeviceManagementHelper.postCreateNewDevice({
        creatorProfileId: creatorProfile.profileId,
        deviceSerial,
        deviceName,
        deviceAddress,
        deviceOwnerId,
        deviceManagerId,
      });
    }
    return result;
  } catch (exception) {
    await handleException(exception, TAG, "postCreateNewDevice");
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
