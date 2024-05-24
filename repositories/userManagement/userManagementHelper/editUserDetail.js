import { logi } from "../../../helpers/log.js";
import bcrypt from "bcrypt";
import { Account, Profile, ArrayId } from "../../../models/index.js";
import { getShortProfile } from "../../profileManagement/profileHelper.js";
import { ObjectId } from "mongodb";
import { handleException } from "../../../exception/Exception.js";

const TAG = "EDIT USER DETAIL";
const putSubAccount = async ({
  accountJWT,
  accountId,
  newPhoneNumber,
  newPassword,
}) => {
  try {
    logi(TAG, "putSubAccount", {
      accountJWT,
      accountId,
      newPhoneNumber,
      newPassword,
    });
    const subAccount = await Account.findWithId(accountId);
    let isModified = false;
    if (
      newPassword !== undefined &&
      newPassword !== "" &&
      !(await bcrypt.compare(newPassword, subAccount.password))
    ) {
      const hashPassword = await bcrypt.hash(
        newPassword,
        parseInt(process.env.SALT_ROUNDS)
      );
      subAccount.password = hashPassword;
      isModified = true;
    }
    if (
      newPhoneNumber !== undefined &&
      newPhoneNumber !== "" &&
      newPhoneNumber !== subAccount.phoneNumber
    ) {
      await Account.checkPhoneNumberNotExist({
        phoneNumber: newPhoneNumber,
      });
      subAccount.phoneNumber = newPhoneNumber;
      let subProfile = await Profile.findWithId(subAccount.profileId);
      subProfile.phoneNumber = newPhoneNumber;
      subProfile.lastModified.editedBy = accountJWT.profileId;
      await subProfile.save();
      isModified = true;
    }
    if (isModified) {
      subAccount.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await subAccount.save();
    }
    const { password, ...returnAccount } = subAccount._doc;
    returnAccount.lastModified = await getShortProfile(
      subAccount.lastModified.editedBy,
      subAccount.lastModified.editedTime
    );
    returnAccount.firstCreated = await getShortProfile(
      subAccount.firstCreated.editedBy,
      subAccount.firstCreated.editedTime
    );
    return returnAccount;
  } catch (exception) {
    await handleException(exception, TAG, "putSubAccount");
  }
};

const putSubProfile = async ({
  accountJWT,
  profileId,
  email,
  name,
  address,
}) => {
  logi(TAG, "putSubProfile", {
    accountJWT,
    profileId,
    email,
    name,
    address,
  });
  try {
    const subProfile = await Profile.findWithId(profileId);
    let isModified = false;
    if (name !== undefined && subProfile.name !== name) {
      subProfile.name = name;
      isModified = true;
    }
    if (email !== undefined && subProfile.email !== email) {
      subProfile.email = email;
      isModified = true;
    }
    if (address !== undefined && subProfile.address !== address) {
      subProfile.address = address;
      isModified = true;
    }

    if (isModified) {
      subProfile.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await subProfile.save();
    }
    let { ...returnProfile } = subProfile._doc;
    if (subProfile.lastModified) {
      returnProfile.lastModified = await getShortProfile(
        subProfile.lastModified.editedBy,
        subProfile.lastModified.editedTime
      );
    }
    return returnProfile;
  } catch (exception) {
    await handleException(exception, TAG, "putSubProfile");
  }
};

const putAddCustomerToStaffSubId = async ({
  accountJWT,
  staffProfileId,
  listNewSubId,
}) => {
  try {
    logi(TAG, "putAddCustomerToStaffSubId", {
      accountJWT,
      staffProfileId,
      listNewSubId,
    });
    if (!Array.isArray(listNewSubId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putAddCustomerToStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    // Find staff profile
    const staffProfile = await Profile.findWithId(ObjectId(staffProfileId));

    // Find staff listSubProfile
    let staffListSubId = await ArrayId.findById(staffProfile.listSubProfile);

    let isModified = false;
    // add id to listSubProfile
    if (listNewSubId.length > 0) {
      for (const element of listNewSubId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findWithId(elementId);
        if (!staffListSubId.ids.some((id) => id.equals(elementId))) {
          // staff save new sub id
          staffListSubId.ids.push(elementId);

          // customer save super id
          const listCustomerSuperProfile = await ArrayId.findById(
            existCustomer.listSuperProfile
          );
          listCustomerSuperProfile.ids.push(staffProfile._id);

          await staffListSubId.save();
          await listCustomerSuperProfile.save();
          existCustomer.lastModified = { editedBy: accountJWT.profileId };
          await existCustomer.save();
          isModified = true;
        }
      }

      // update listSubProfile
      if (isModified) {
        staffProfile.lastModified = {
          editedBy: accountJWT.profileId,
        };

        // save to database
        await staffProfile.save();
      }
    }
    return "Add customer(s) successfully";
  } catch (exception) {
    await handleException(exception, TAG, "putAddCustomerToStaffSubId");
  }
};

const putRemoveCustomerFromStaffSubId = async ({
  accountJWT,
  staffProfileId,
  listRemoveSubId,
}) => {
  try {
    logi(TAG, "putRemoveCustomerFromStaffSubId", {
      accountJWT,
      staffProfileId,
      listRemoveSubId,
    });
    // check Array
    if (!Array.isArray(listRemoveSubId)) {
      throw new Exception(
        Exception.INVALID_ARRAY,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    const staffProfile = await Profile.findWithId(ObjectId(staffProfileId));

    if (!staffProfile) {
      throw new Exception(
        Exception.PROFILE_DATA_NOT_EXIST,
        TAG,
        "putRemoveCustomerFromStaffSubId",
        HTTPCode.BAD_REQUEST
      );
    }

    const staffListSubId = await ArrayId.findById(staffProfile.listSubProfile);

    let isModified = false;
    // Remove id in listRemoveSubId
    if (listRemoveSubId.length > 0) {
      for (const element of listRemoveSubId) {
        const elementId = ObjectId(element);
        const existCustomer = await Profile.findWithId(elementId);
        const listCustomerSuperProfile = await ArrayId.findById(
          existCustomer.listSuperProfile
        );
        // remove sub id
        staffListSubId.ids = staffListSubId.ids.filter(
          (id) => !id.equals(elementId)
        );

        //remove super id
        listCustomerSuperProfile.ids = listCustomerSuperProfile.ids.filter(
          (id) => !id.equals(staffProfile._id)
        );

        await staffListSubId.save();
        await listCustomerSuperProfile.save(); // save
        existCustomer.lastModified = { editedBy: accountJWT.profileId };
        await existCustomer.save();
        isModified = true;
      }
    }

    if (isModified) {
      staffProfile.lastModified = {
        editedBy: accountJWT.profileId,
      };
      await staffProfile.save();
    }
    return "Remove customer(s) successfully";
  } catch (exception) {
    await handleException(exception, TAG, "putRemoveCustomerFromStaffSubId");
  }
};

export default {
  putSubAccount,
  putSubProfile,
  putAddCustomerToStaffSubId,
  putRemoveCustomerFromStaffSubId,
};
