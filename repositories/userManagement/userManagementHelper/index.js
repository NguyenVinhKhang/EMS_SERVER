import listUser from "./listUser.js";
import getUserDetail from "./getUserDetail.js";
import editUserDetail from "./editUserDetail.js";
import createNewUser from "./createNewUser.js";

export default {
  getListCustomerWithStaffId: listUser.getListCustomerWithStaffId,
  getListSub: listUser.getListSub,
  getListSuper: listUser.getListSuper,
  getSubAccount: getUserDetail.getSubAccount,
  getSubProfile: getUserDetail.getSubProfile,
  putSubAccount: editUserDetail.putSubAccount,
  putSubProfile: editUserDetail.putSubProfile,
  putAddCustomerToStaffSubId: editUserDetail.putAddCustomerToStaffSubId,
  putRemoveCustomerFromStaffSubId:
    editUserDetail.putRemoveCustomerFromStaffSubId,
  postCreateNewUser: createNewUser.postCreateNewUser,
};
