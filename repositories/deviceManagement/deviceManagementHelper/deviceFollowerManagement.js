import Exception, { handleException } from "../../../exception/Exception.js";
import HTTPCode from "../../../exception/HTTPStatusCode.js";
import { logi, logw } from "../../../helpers/log.js";
import {
  ArrayId,
  Device,
  Profile,
  RequestPool,
} from "../../../models/index.js";
import { ObjectId } from "mongodb";
import { getShortProfile } from "../../profileManagement/profileHelper.js";

const TAG = "DEVICE FOLLOWER MANAGEMENT";

const postCreateRequestFollowDevice = async ({ creatorId, deviceSerial }) => {
  try {
    logi(TAG, "postCreateRequestFollowDevice", {
      creatorId,
      deviceSerial,
    });
    let creatorProfile = await Profile.findById(creatorId);
    let listCreatorListFollowingDevice = await ArrayId.findById(
      creatorProfile.listDeviceFollowing
    );
    let deviceInfo = await Device.findBySerial(deviceSerial);
    if (listCreatorListFollowingDevice.ids.includes(deviceInfo._id)) {
      throw new Exception(
        Exception.DEVICE_ALREADY_FOLLOWING,
        TAG,
        "postCreateRequestFollowDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    let result = await RequestPool.createNewRequest(creatorId, deviceSerial);
    let returnResult = { ...result._doc };
    returnResult.firstCreated = await getShortProfile(
      result.firstCreated.editedBy,
      result.firstCreated.editedTime
    );
    return returnResult;
  } catch (exception) {
    await handleException(exception, TAG, "putAddCustomerToStaffSubId");
  }
};

const putRemoveRequestFollowDevice = async ({ editorId, deviceSerial }) => {
  try {
    logi(TAG, "putRemoveRequestFollowDevice", {
      editorId,
      deviceSerial,
    });

    // Find and delete the request with the given serial
    const deletedRequest = await RequestPool.findOne({
      serial: deviceSerial,
    });
    if (!deletedRequest) {
      throw new Exception(
        Exception.REQUEST_DOES_NOT_EXIST,
        TAG,
        "putRemoveRequestFollowDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    if (toString(deletedRequest.firstCreated.editedBy) !== toString(editorId)) {
      throw new Exception(
        Exception.ACCOUNT_ACCESS_DENIED,
        TAG,
        "putRemoveRequestFollowDevice",
        HTTPCode.BAD_REQUEST
      );
    }
    await RequestPool.deleteOne({ _id: deletedRequest._id });
    return "Request successfully deleted";
  } catch (exception) {
    await handleException(exception, TAG, "putRemoveRequestFollowDevice");
  }
};

const getListRequestMake = async ({
  profileId,
  page,
  size,
  status,
  searchString,
}) => {
  try {
    logi(TAG, "getListRequestMake", {
      profileId,
      page,
      size,
      status,
      searchString,
    });

    const profileObjectId = ObjectId(profileId);
    const skip = (page - 1) * size;
    const limit = size; // Đảm bảo rằng limit được định nghĩa

    // Đặt giá trị mặc định cho status nếu không có hoặc rỗng
    if (!status || status.trim() === "") {
      status = "pending";
    }

    // Khởi tạo điều kiện tìm kiếm cơ bản
    let matchConditions = {
      "firstCreated.editedBy": profileObjectId,
      status: status,
    };

    // Thêm điều kiện tìm kiếm nếu searchString tồn tại và không rỗng
    if (searchString && searchString.trim() !== "") {
      matchConditions.$or = [
        { serial: { $regex: new RegExp(searchString, "i") } },
      ];
    }

    // Thực hiện truy vấn với các điều kiện đã xây dựng
    const result = await RequestPool.find(matchConditions)
      .skip(skip)
      .limit(limit);

    return { resultSize: result.length, result: result };
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestMake");
  }
};

const getListRequestToDevice = async ({ deviceSerial, page, size, status }) => {
  try {
    logi(TAG, "getListRequestToDevice", {
      deviceSerial,
      page,
      size,
      status,
    });
    const skip = (page - 1) * size;
    if (!status) {
      status = "pending";
    }
    const result = await RequestPool.find({
      serial: deviceSerial,
      status: status,
    })
      .skip(skip)
      .limit(size);

    return { resultSize: result.length, result: result };
  } catch (exception) {
    await handleException(exception, TAG, "getListRequestToDevice");
  }
};

const putResponseRequestToDevice = async ({
  editorProfileId,
  requestPoolId,
  status,
}) => {
  try {
    logi(TAG, "putResponseRequestToDevice", {
      editorProfileId,
      requestPoolId,
      status,
    });
    let requestPool = await RequestPool.findById(requestPoolId);
    if (status === "accept") {
      let ress = await putAddCustomerToDeviceFlowerList({
        editorProfileId: editorProfileId,
        deviceSerial: requestPool.serial,
        listNewFollowerId: [requestPool.firstCreated.editedBy],
      });
      logw(TAG, "putResponseRequestToDevice", ress);
    }
    requestPool.status = status;
    await requestPool.save()
    return requestPool;
  } catch (exception) {
    await handleException(exception, TAG, "putResponseRequestToDevice");
  }
};

const putAddCustomerToDeviceFlowerList = async ({
  editorProfileId,
  deviceSerial,
  listNewFollowerId,
}) => {
  try {
    logi(TAG, "putAddCustomerToDeviceFlowerList", {
      editorProfileId,
      deviceSerial,
      listNewFollowerId,
    });
    if (!Array.isArray(listNewFollowerId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }
    //Device detail and device listFollower
    let deviceExist = await Device.findBySerial(deviceSerial);
    let listIdFollower = await ArrayId.findById(deviceExist.deviceFollower);

    let isModified = false;
    if (listNewFollowerId.length > 0) {
      for (const element of listNewFollowerId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findWithId(elementId);
        if (!listIdFollower.ids.some((id) => id.equals(elementId))) {
          // device save new sub id
          listIdFollower.ids.push(elementId);
          // customer save device id
          let listDeviceId = await ArrayId.findById(
            existCustomer.listDeviceFollowing
          );
          listDeviceId.ids.push(deviceExist._id);
          logw(TAG, "putAddCustomerToDeviceFlowerList", listDeviceId);
          await listIdFollower.save();
          await listDeviceId.save(); // save
          existCustomer.lastModified = { editedBy: editorProfileId };
          await existCustomer.save();
          isModified = true;
        }
      }

      // update device
      if (isModified) {
        deviceExist.lastModified = {
          editedBy: editorProfileId,
        };

        // save to database
        await deviceExist.save();
      }
    }
  } catch (exception) {
    await handleException(exception, TAG, "putAddCustomerToDeviceFlowerList");
  }
};

const putRemoveCustomerFromDeviceFollowerList = async ({
  editorProfileId,
  deviceSerial,
  listRemoveFollowerId,
}) => {
  try {
    logi(TAG, "putRemoveCustomerFromDeviceFollowerList", {
      editorProfileId,
      deviceSerial,
      listRemoveFollowerId,
    });

    if (!Array.isArray(listRemoveFollowerId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putRemoveCustomerFromDeviceFollowerList",
        HTTPCode.BAD_REQUEST
      );
    }

    // Find device
    const deviceExist = await Device.findBySerial(deviceSerial);

    // Find device's list of followers
    let listIdFollower = await ArrayId.findById(deviceExist.deviceFollower);

    let isModified = false;

    if (listRemoveFollowerId.length > 0) {
      for (const element of listRemoveFollowerId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findWithId(elementId);

        // Remove follower id from device
        listIdFollower.ids = listIdFollower.ids.filter(
          (id) => !id.equals(elementId)
        );

        // Remove device id from customer
        let listDeviceId = await ArrayId.findById(
          existCustomer.listDeviceFollowing
        );
        listDeviceId.ids = listDeviceId.ids.filter(
          (id) => !id.equals(deviceExist._id)
        );

        // Save changes
        await listIdFollower.save();
        await listDeviceId.save();
        existCustomer.lastModified = { editedBy: editorProfileId };
        await existCustomer.save();

        isModified = true;
      }

      // Update device if modified
      if (isModified) {
        deviceExist.lastModified = { editedBy: editorProfileId };
        // Save changes
        await deviceExist.save();
      }
    }
  } catch (exception) {
    await handleException(
      exception,
      TAG,
      "putRemoveCustomerFromDeviceFollowerList"
    );
  }
};

export default {
  getListRequestMake,
  getListRequestToDevice,
  putAddCustomerToDeviceFlowerList,
  putRemoveCustomerFromDeviceFollowerList,
  putResponseRequestToDevice,
  postCreateRequestFollowDevice,
  putRemoveRequestFollowDevice,
};
