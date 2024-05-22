import jwt from "jsonwebtoken";
import tmpLogin from "../models/tmpLogin.js";
import { logi } from "../helpers/log.js";

export var tokenMap = {
  add: async function (token, user) {
    const existingUser = await tmpLogin.findOne({
      "user.phoneNumber": user.phoneNumber,
    });
    if (existingUser) {
      await tmpLogin.deleteOne({ "user.phoneNumber": user.phoneNumber });
    }
    await tmpLogin.create({ token: token, user: user });
  },

  remove: async function (token) {
    await tmpLogin.deleteOne({ token: token });
  },
  get: async function (token) {
    const result = await tmpLogin.findOne({ token: token });
    return result ? result.user : {};
  },
  refresh: async function () {
    const tokens = await tmpLogin.find({});
    for (let tokenRecord of tokens) {
      try {
        jwt.verify(tokenRecord.token, process.env.JWT_SECRET);
      } catch (error) {
        await tmpLogin.deleteOne({ token: tokenRecord.token });
      }
    }
  },
};

// export var tokenMap = {
//   count: 0,
//   data: {},
//   add: function (token, user) {
//     ++this.count;
//     this.data[token] = user;
//   },
//   remove: function (token) {
//     --this.count;
//     this.data[token] = null;
//   },
//   get: function (token) {
//     return this.data[token] ?? {};
//   },
//   refresh: function () {
//     let map = {};
//     let count = 0;
//     for (let k in this.data) {
//       let user = this.data[k];
//       let jwtObject;
//       try {
//         jwtObject = jwt.verify(
//           k,
//           process.env.JWT_SECRET
//         );
//       } catch (error) {
//         jwtObject = null;
//       }
//       if (user && jwtObject) {
//         ++count;
//         map[k] = user;
//       }
//     }
//     this.count = count;
//     this.data = map;
//   },

// };
