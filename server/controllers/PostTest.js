import PostTest from "../models/PostTest.js";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import npmlog, { error } from "npmlog";
import dotenv from "dotenv";
import { insertPostTestLog } from "./PostTestLog.js";
import {
  authorizeAdmin,
  getAdminId,
  authorizeEditor,
  getEditorId,
} from "../utils/Authorize.js";

import { v2 as cloudinary } from "cloudinary";
import redisClient from "../redis/RedisConfigration.js";

//dotenv configratgion
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

export const getTestPost = async (req, res) => {
  const { id } = req.params;
  await redisClient.del(id);
  PostTest.findById(id)
    .then((post) => {
      redisClient.set(id, JSON.stringify(post));
      res.status(200).json({ status: "ok", fromCache: false, data: post });
    })
    .catch((error) => {
      res.status(404).json({ status: "no", message: error.message });
    });
};

export const getAllTestPosts = async (req, res) => {
  try {
    const posts = await PostTest.find();
    await posts.forEach((post) => {
      redisClient.hsetnx(
        "posts",
        post._id,
        JSON.stringify(post),
        (error, result) => {
          if (error) {
            console.log(`Error : ${error.message}`);
          } else if (result === 1) {
            console.log(`Post ${post._id} has added successfully.`);
          } else {
            console.log(`${post._id} is already exists.`);
          }
        }
      );
    });
    res.status(200).json({ status: "ok", fromCache: false, data: posts });
  } catch (error) {
    res.status(404).json({
      status: "no",
      fromCache: false,
      message: error.message,
    });
  }
};

export const addTestPost = async (req, res) => {
  const { title, content, author, img } = req.body;
  const { token } = req.params;

  if (!img) {
    var result = await cloudinary.uploader.upload(req.file.path);
  }

  const newTestPost = new PostTest({
    title,
    content,
    author,
    img,
  });

  try {
    let processorId;
    let postId;
    if (await getAdminId(token)) {
      processorId = await getAdminId(token);
    } else {
      processorId = await getEditorId(token);
    }
    if ((await authorizeAdmin(token)) || (await authorizeEditor(token))) {
      await newTestPost.save().then((post) => {
        postId = post._id;
        npmlog.info(`New Post Added ${newTestPost.title} by ${processorId}`);
      });

      insertPostTestLog({
        post: postId,
        processor: processorId,
        logMessage: `New Post Added ${newTestPost.title} by ${processorId}`,
        logType: "insert",
        success: true,
      });

      res.status(200).json({ status: "ok" });
    } else {
      npmlog.warn(
        `Post Insertion Has Tried By ${
          processorId ? processorId : process.env.TEST_ADMIN_ID
        }`
      );

      insertPostTestLog({
        post: `${process.env.TEST_POST_ID}`,
        processor: `${processorId ? processorId : process.env.TEST_ADMIN_ID}`,
        logMessage: `Post Insertion Has Tried By ${
          processorId ? processorId : process.env.TEST_ADMIN_ID
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
    npmlog.warn(`Post Insertion Has Tried By  ${process.env.TEST_ADMIN_ID}`);
    insertPostTestLog({
      post: `${process.env.TEST_POST_ID}`,
      processor: `${process.env.TEST_ADMIN_ID}`,
      logMessage: `Post Insertion Has Tried By  ${process.env.TEST_ADMIN_ID}`,
      logType: "insert",
      success: false,
    });

    res.status(404).json({ status: "no", message: error.message });
  }
};

export const updateTestPost = async (req, res) => {
  const { id, title, content, author, img } = req.body;
  const { token } = req.params;

  if (!img) {
    var result = await cloudinary.uploader.upload(req.file.path);
  }

  let processorId;
  let redisUpdateStatus;
  let newPost;

  try {
    if (await getAdminId(token)) {
      processorId = await getAdminId(token);
    } else {
      processorId = await getEditorId(token);
    }

    if ((await authorizeAdmin(token)) || (await authorizeEditor(token))) {
      await PostTest.findByIdAndUpdate(id, {
        title: title,
        content: content,
        author: author,
        img: img,
      }).then((result) => {
        npmlog.info(`${id} || ${title} post updated by ${processorId}.`);
        newPost = result;
        insertPostTestLog({
          post: `${id}`,
          processor: `${processorId}`,
          logMessage: `${id} || ${title} post updated by ${processorId}.`,
          logType: "update",
          success: true,
        });
      });
      redisClient.hset("posts", id, JSON.stringify(newPost), (err, reply) => {
        if (err) {
          redisUpdateStatus = false;
        }
        redisUpdateStatus = true;
      });
      redisClient.set(id, JSON.stringify(newPost), (err, reply) => {
        if (err) {
          redisUpdateStatus = false;
        }
        redisUpdateStatus = true;
      });

      res.status(200).json({
        status: "ok",
        message: "Post has updated!",
        redisUpdate: redisUpdateStatus,
      });
    } else {
      res.status(404).json({
        status: "no",
        message: "You don't have permission for this process!",
        redisUpdate: redisUpdateStatus,
      });
    }
  } catch (error) {
    npmlog.warn(
      `Post update was tried to be updated by ${
        processorId ? processorId : process.env.TEST_ADMIN_ID
      }`
    );

    insertPostTestLog({
      post: `${id ? id : process.env.TEST_POST_ID}`,
      processor: `${processorId ? processorId : process.env.TEST_ADMIN_ID}`,
      logMessage: `Post update was tried to be updated by ${
        processorId ? processorId : process.env.TEST_ADMIN_ID
      }`,
      logType: "update",
      success: false,
    });

    res.status(404).json({
      status: "no",
      message: error.message,
      redisUpdate: redisUpdateStatus,
    });
  }
};
