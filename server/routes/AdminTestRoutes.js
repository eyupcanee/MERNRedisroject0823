import express from "express";
import multer from "multer";
import {
  addTestAdmin,
  loginTestAdmin,
  logoutTestAdmin,
  getTestAdmin,
  getAllTestAdmins,
  updateTestAdmin,
} from "../controllers/AdminTest.js";

import {
  getTestAdminCached,
  getAllTestAdminsCached,
} from "../redis/AdminTestCache.js";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/addadmin/:token", upload.single("img"), addTestAdmin);
router.post("/updateadmin/:token", upload.single("img"), updateTestAdmin);
router.post("/login", loginTestAdmin);
router.post("/logout/:token", logoutTestAdmin);
router.get("/get/:id", getTestAdminCached, getTestAdmin);
router.get("/get", getAllTestAdminsCached, getAllTestAdmins);

export default router;
