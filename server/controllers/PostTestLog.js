import mongoose from "mongoose";
import PostTestLog from "../models/PostTestLog.js";

export const insertPostTestLog = async (log) => {
  const newLog = new AdminTestLog({
    post: log.id,
    processor: log.processorId,
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
