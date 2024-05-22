import Exception from "../exception/Exception.js";
import HTTPCode from "../exception/HTTPStatusCode.js";

const adminRight = {
  admin: 1,
};
const staffRight = {
  admin: 1,
  staff: 1,
};
const userRight = {
  admin: 1,
  staff: 1,
  customer: 1,
};

export async function checkAdminRight(role) {
  if (!adminRight[role]) {
    throw new Exception(
      Exception.ACCOUNT_ACCESS_DENIED,
      "Authorization",
      "checkAdminRight",
      HTTPCode.BAD_REQUEST
    );
  } else {
    return 0;
  }
}
export async function checkStaffRight(role) {
  if (!staffRight[role]) {
    throw new Exception(
      Exception.ACCOUNT_ACCESS_DENIED,
      "Authorization",
      "checkAdminRight",
      HTTPCode.BAD_REQUEST
    );
  } else {
    return 1;
  }
}
export async function checkCustomerRight(role) {
  if (!userRight[role]) {
    throw new Exception(
      Exception.ACCOUNT_ACCESS_DENIED,
      "Authorization",
      "checkAdminRight",
      HTTPCode.BAD_REQUEST
    );
  } else {
    return 2;
  }
}
