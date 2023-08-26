import mongoose from "mongoose";
import AdminTestLog from "../models/AdminTestLog.js";

export const insertAdminTestLog = async (log) => {
  const newLog = new AdminTestLog({
    admin: log.id,
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
