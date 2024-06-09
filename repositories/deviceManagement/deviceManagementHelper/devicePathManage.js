import { handleException } from "../../../exception/Exception.js";
import { logi } from "../../../helpers/log.js";
import { ArrayId, Device, Profile } from "../../../models/index.js";
import returnDeviceDetail from "./helper.js";

const TAG = "DEVICE PATH MANAGE";

const putEditDevicePath = async ({
  editorProfileId,
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
    logi(TAG, "putEditDevicePath", { deviceSerial });

    let deviceExist = await Device.findBySerial(deviceSerial);

    let updated = false;

    if (path0 !== undefined && path0 !== "") {
      deviceExist.path0.pathName = path0;
      updated = true;
    }
    if (path1 !== undefined && path1 !== "") {
      deviceExist.path1.pathName = path1;
      updated = true;
    }
    if (path2 !== undefined && path2 !== "") {
      deviceExist.path2.pathName = path2;
      updated = true;
    }
    if (path3 !== undefined && path3 !== "") {
      deviceExist.path3.pathName = path3;
      updated = true;
    }
    if (path4 !== undefined && path4 !== "") {
      deviceExist.path4.pathName = path4;
      updated = true;
    }
    if (path5 !== undefined && path5 !== "") {
      deviceExist.path5.pathName = path5;
      updated = true;
    }
    if (path6 !== undefined && path6 !== "") {
      deviceExist.path6.pathName = path6;
      updated = true;
    }
    if (path7 !== undefined && path7 !== "") {
      deviceExist.path7.pathName = path7;
      updated = true;
    }

    if (updated) {
      let editorProfile = await Profile.findWithId(editorProfileId);
      deviceExist.lastModified = {
        editedBy: editorProfile._id,
      };

      await deviceExist.save();
    }
    let returnDataDevice = await returnDeviceDetail(deviceExist);

    return returnDataDevice;
  } catch (exception) {
    await handleException(exception, TAG, "putEditDevicePath");
  }
};

export default { putEditDevicePath };
