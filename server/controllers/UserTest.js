import UserTest from "../models/UserTest.js";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import npmlog from "npmlog";
import dotenv from "dotenv";
import { insertUserTestLog } from "./UserTestLog.js";
import {
  authotizeUser,
  getUserId,
  authorizeEditor,
  getEditorId,
} from "../utils/Authorize.js";

import { v2 as cloudinary } from "cloudinary";
import redisClient from "../redis/RedisConfigration.js";

//dotenv configration
dotenv.config({ path: "./.env.development.local" });

//cloudinary configration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//redis configration
async () => {
  try {
    await redisClient.connect();
  } catch (error) {}
};

export const loginTestUser = async (req, res) => {
  try {
    const password = req.body.password;
    const user = await UserTest.findOne({
      email: req.body.email,
    });

    if (!user) {
    } else {
      if (await bcrypt.compare(password, user.password)) {
        if (user.active) {
        } else {
        }
      } else {
      }
    }
  } catch (error) {}
};
