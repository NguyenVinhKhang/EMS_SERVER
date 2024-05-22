import { AccountRepository } from "../index.js";
import HTTPCode from "../../exception/HTTPStatusCode.js";
import { logi, logw } from "../../helpers/log.js";
import { faker } from "@faker-js/faker";
import { Account, ArrayId, Profile } from "../../models/index.js";
import bcrypt from "bcrypt";
import Exception from "../../exception/Exception.js";

const TAG = "FAKE_DATA";

const createFakeAdmin = async () => {
  try {
    let hashPassword = await bcrypt.hash(
      "admin123",
      parseInt(process.env.SALT_ROUNDS)
    );
    const fakeAdminAccount = {
      phoneNumber: "09999999999",
      role: "admin",
      password: hashPassword,
    };

    const newAdminAccount = await Account.create(fakeAdminAccount);

    const fakeAdminProfile = {
      name: `ems-admin-fake`,
      phoneNumber: newAdminAccount.phoneNumber,
      role: "admin",
      accountId: newAdminAccount._id,
    };

    const newAdminProfile = await Profile.create(fakeAdminProfile);

    (newAdminAccount.profileId = newAdminProfile._id),
      (newAdminAccount.lastModified = {
        editedBy: newAdminProfile._id,
      });
    newAdminAccount.firstCreated = {
      editedBy: newAdminProfile._id,
    };
    await newAdminAccount.save();
    const listSubStaff = new ArrayId({
      ids: [],
    });
    await listSubStaff.save();
    newAdminProfile.listSubProfile = listSubStaff._id;

    newAdminProfile.lastModified = {
      editedBy: newAdminProfile._id,
    };
    await newAdminProfile.save();
    return newAdminProfile._id;
  } catch (exception) {
    throw new Exception(
      exception,
      TAG,
      "CREATE ADMIN",
      HTTPCode.INTERNAL_SERVER_ERROR
    );
  }
};

const createFakeStaff = async (adminId) => {
  try {
    let adminProfile = await Profile.findOne({ _id: adminId });
    let adminListSub = await ArrayId.findOne({
      listSubProfile: adminProfile.listSubProfile,
    });
    for (let i = 0; i < 2; i++) {
      let hashPassword = await bcrypt.hash(
        "staff123",
        parseInt(process.env.SALT_ROUNDS)
      );
      const newStaffAccount = await Account.create({
        phoneNumber: `0987654321` + i.toString(),
        role: "staff",
        password: hashPassword,
      });

      const newStaffProfile = await Profile.create({
        name: `ems-staff-fake` + i,
        phoneNumber: newStaffAccount.phoneNumber,
        role: "staff",
        accountId: newStaffAccount._id,
      });

      //update profile last modified anf first created
      newStaffAccount.profileId = newStaffProfile._id;
      newStaffAccount.firstCreated = {
        editedBy: adminProfile._id,
      };
      newStaffAccount.lastModified = {
        editedBy: adminProfile._id,
      };

      await newStaffAccount.save();

      //create list sub user
      const listSubCustomer = new ArrayId({
        ids: [],
      });
      await listSubCustomer.save();
      newStaffProfile.listSubProfile = listSubCustomer._id;

      const listSuper = new ArrayId({
        ids: [],
      });
      await listSuper.save();
      newStaffProfile.listSuperProfile = listSuper._id;
      listSuper.ids.push(adminProfile._id);
      await listSuper.save();

      //update profile last modified
      newStaffProfile.lastModified = {
        editedBy: adminProfile._id,
      };

      await newStaffProfile.save();
      adminListSub.ids.push(newStaffProfile._id);
      await adminListSub.save();
    }
  } catch (exception) {
    throw new Exception(
      exception,
      TAG,
      "CREATE STAFF",
      HTTPCode.INTERNAL_SERVER_ERROR
    );
  }
};

async function generateFakeAccount(req, res) {
  logw(TAG, "fake data");

  try {
    const newAdminProfile = await createFakeAdmin();
    await createFakeStaff(newAdminProfile);
    for (let index = 0; index < 20; index++) {
      const fakeCustomer = {
        name: `${faker.person.fullName()}-faker`,
        phoneNumber: "987654321" + index,
        staffPhoneNumber: faker.helpers.arrayElement([
          "09876543210",
          "09876543211",
          "",
        ]),
        password: faker.helpers.arrayElement(["123456", "654321"]),
      };
      await AccountRepository.register(fakeCustomer);
    }
    return "Fake data success";
  } catch (exception) {
    if (exception instanceof Exception) {
      throw exception;
    } else {
      throw new Exception(
        exception,
        TAG,
        "Generate Fake Account",
        HTTPCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default {
  generateFakeAccount,
};
