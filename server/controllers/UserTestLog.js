import mongoose from "mongoose";
import UserTestLog from "../models/UserTestLog.js";

export const insertUserTestLog = async (log) => {
  const newLog = new UserTestLog({
    user: log.id,
    logMessage: log.logMessage,
    logType: log.logType,
    success: log.success,
  });

  try {
    newLog.save();
  } catch (error) {
    console.log(error.message);
  }
};
