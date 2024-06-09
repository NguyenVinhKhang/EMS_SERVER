import {
  accountRouter,
  fakeDataRoute,
  profileRouter,
  userManagementRoute,
  deviceManagementRoute,
} from "./index.js";

export const guestURL = {
  "/ems/account/login": 1,
  "/ems/account/register": 1,
  "/ems": 1,
  "/ems/fake/data": 1,
  "/ems/": 1,
};

export const routers = [
  { path: "/ems/account", router: accountRouter },
  { path: "/ems/profile", router: profileRouter },
  { path: "/ems/usermanagement", router: userManagementRoute },
  { path: "/ems/devicemanagement", router: deviceManagementRoute },
  { path: "/ems/fake", router: fakeDataRoute },
];
