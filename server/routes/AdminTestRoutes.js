import express from "express";
import multer from "multer";
import {
  addTestAdmin,
  loginTestAdmin,
  logoutTestAdmin,
} from "../controllers/AdminTest.js";

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post("/addadmin/:token", upload.single("img"), addTestAdmin);
router.post("/login", loginTestAdmin);
router.post("/logout/:token", logoutTestAdmin);

export default router;
