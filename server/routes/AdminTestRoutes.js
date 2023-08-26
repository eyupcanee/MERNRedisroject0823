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

router.post("/addadmin", upload.single("img"), addTestAdmin);
export default router;
