import createNewDevice from "./deviceCreateNew.js";
import deviceList from "./deviceList.js";
import getDeviceDetail from "./deviceDetail.js";
import editDeviceDetail from "./deviceEditDetail.js";
import devicePathManage from "./devicePathManage.js";
import deviceFollowerManagement from "./deviceFollowerManagement.js";

export default {
  postCreateNewDevice: createNewDevice.postCreateNewDevice,
  getListAllDevice: deviceList.getListAllDevice,
  getListDeviceManageById: deviceList.getListDeviceManageById,
  getCustomerListManageDevice: deviceList.getCustomerListManageDevice,
  getCustomerListFollowingDevice: deviceList.getCustomerListFollowingDevice,
  getListDeviceFollowingById: deviceList.getListDeviceFollowingById,
  getDeviceDetail: getDeviceDetail.getDeviceDetail,
  getListDeviceFollower: getDeviceDetail.getListDeviceFollower,
  putEditDeviceDetail: editDeviceDetail.putEditDeviceDetail,
  putAdminChangeDeviceOwner: editDeviceDetail.putAdminChangeDeviceOwner,
  putStaffChangeDeviceOwner: editDeviceDetail.putStaffChangeDeviceOwner,
  putEditDevicePath: devicePathManage.putEditDevicePath,
  putChangeDeviceManager: editDeviceDetail.putChangeDeviceManager,
  putAddCustomerToDeviceFlowerList:
    deviceFollowerManagement.putAddCustomerToDeviceFlowerList,
  putRemoveCustomerFromDeviceFollowerList:
    deviceFollowerManagement.putRemoveCustomerFromDeviceFollowerList,
  getListRequestMake: deviceFollowerManagement.getListRequestMake,
  getListRequestToDevice: deviceFollowerManagement.getListRequestToDevice,
  putResponseRequestToDevice:
    deviceFollowerManagement.putResponseRequestToDevice,
  postCreateRequestFollowDevice:
    deviceFollowerManagement.postCreateRequestFollowDevice,
  putRemoveRequestFollowDevice:
    deviceFollowerManagement.putRemoveRequestFollowDevice,
};
