import AdminTest from "../models/AdminTest.js";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import npmlog from "npmlog";
import dotenv from "dotenv";
import { insertAdminTestLog } from "./AdminTestLog.js";
import { authorizeAdmin, getAdminId } from "../utils/Authorize.js";

import { v2 as cloudinary } from "cloudinary";
import redis from "redis";

//dotenv configration
dotenv.config({ path: "./.env.development.local" });

//cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//redis configration

export const loginTestAdmin = async (req, res) => {
  try {
    const password = req.body.password;
    const admin = await AdminTest.findOne({
      email: req.body.email,
    });

    if (!admin) {
      res.status(404).json({ status: "no" });
    }

    if (await bcrypt.compare(password, admin.password)) {
      const token = jwt.sign(
        {
          id: admin._id,
          role: admin.role,
        },
        process.env.JWT_CODE
      );
      npmlog.info(`${admin.name} ${admin.surname} Has Logged In As An Admin`);
      await insertAdminTestLog({
        id: admin._id,
        logMessage: `${admin.name} ${admin.surname} Has Logged In As An Admin`,
        logType: "login",
        success: true,
      });

      res.status(200).json({ status: "ok", token: token });
    } else {
      npmlog.warn(
        `${admin.name} ${admin.surname} Has Tried Logging In As An Admin`
      );
      await insertAdminTestLog({
        id: admin._id,
        logMessage: `${admin.name} ${admin.surname} Has Tried Logging In As An Admin`,
        logType: "login",
        success: false,
      });
      res.status(404).json({ status: "no" });
    }
  } catch (error) {
    res.status(404).json({ status: "no" });
  }
};

export const logoutTestAdmin = async (req, res) => {
  const { token } = req.params;

  try {
    if (await authorizeAdmin(token)) {
      const adminId = await getAdminId(token);
      const admin = await AdminTest.findById(adminId);
      npmlog.info(`${admin.name} ${admin.surname} has logged out.`);
      await insertAdminTestLog({
        id: adminId,
        logMessage: `${admin.name} ${admin.surname} has logged out.`,
        logType: "logout",
        success: true,
      });
      res.status(200).json({ status: "ok" });
    } else {
      res.status(404).json({ status: "no" });
    }
  } catch (error) {
    res.status(404).json({ status: "no" });
  }
};

export const addTestAdmin = async (req, res) => {
  const { name, surname, email, password, occupation, phoneNumber } = req.body;
  const { token } = req.params;
  const encryptedPassword = await bcrypt.hash(password, 8);
  const result = await cloudinary.uploader.upload(req.file.path);

  const newTestAdmin = new AdminTest({
    name,
    surname,
    email,
    password: encryptedPassword,
    img: result.secure_url,
    occupation,
    phoneNumber,
  });

  try {
    const adminId = await getAdminId(token);
    if (await authorizeAdmin(token)) {
      await newTestAdmin.save().then(() => {
        npmlog.info(
          `New Admin Added ${newTestAdmin.name} ${newTestAdmin.surname} by ${adminId}`
        );

        insertAdminTestLog({
          id: adminId,
          logMessage: `New Admin Added ${newTestAdmin.name} ${newTestAdmin.surname} by ${adminId}`,
          logType: "insert",
          success: true,
        });

        res.status(200).json({ status: "ok" });
      });
    } else {
      npmlog.warn(
        `Admin Insertion Has Tried By ${
          adminId ? adminId : process.env.TEST_ADMIN_ID
        }`
      );
      insertAdminTestLog({
        id: `${adminId ? adminId : process.env.TEST_ADMIN_ID}`,
        logMessage: `Admin Insertion Has Tried By ${
          adminId ? adminId : process.env.TEST_ADMIN_ID
        }`,
        logType: "insert",
        success: false,
      });

      res.status(404).json({
        status: "no",
        message: "You don't have permission for this process!",
      });
    }
  } catch (error) {
    npmlog.warn(`Admin Insertion Has Tried By ${process.env.TEST_ADMIN_ID}`);
    insertAdminTestLog({
      id: `${process.env.TEST_ADMIN_ID}`,
      logMessage: `Admin Insertion Has Tried By ${process.env.TEST_ADMIN_ID}`,
      logType: "insert",
      success: false,
    });
  }
};

export const updateTestAdmin = async (req, res) => {
  const { id, name, surname, email, password, img, phoneNumber, occupation } =
    req.body;
  const { token } = req.params;
  const encryptedPassword = await bcrypt.hash(password, 8);

  if (await authorizeAdmin(token)) {
    const adminId = await getAdminId(token);
    const admin = await AdminTest.findById(adminId);
    await AdminTest.findByIdAndUpdate(id, {
      name: name,
      surname: surname,
      email: email,
      password: encryptedPassword,
      img: img,
      phoneNumber: phoneNumber,
      occupation: occupation,
    })
      .then(() => {
        npmlog.info(
          `${name} ${surname} updated by ${admin.name} ${admin.surname}. Admin Id : ${adminId}`
        );
        insertAdminTestLog({
          id: adminId,
          logMessage: `${name} ${surname} updated by ${admin.name} ${admin.surname}. Admin Id : ${adminId}`,
          logType: "update",
          success: true,
        });
        res
          .status(200)
          .json({ status: "ok", message: "Admin informations have updated." });
      })
      .catch((error) => {
        npmlog.warn(
          `${name} ${surname}'s datas was tried to be updated by ${admin.name} ${admin.surname}. Admin Id: ${adminId}`
        );
        insertAdminTestLog({
          id: adminId,
          logMessage: `${name} ${surname}'s datas was tried to be updated by ${admin.name} ${admin.surname}. Admin Id: ${adminId}`,
          logType: "update",
          success: false,
        });

        res.status(404).json({
          status: "no",
          message: `An error was encountered. Error : ${error.message}`,
        });
      });
  } else {
    res.status(404).json({
      status: "no",
      message: "You don't have permission for this process!",
    });
  }
};
