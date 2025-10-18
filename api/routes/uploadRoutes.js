import express from "express";
import upload from "../middleware/multer.js"; // this should be Cloudinary-based multer-storage
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

// Single image upload route
router.post("/", upload.single("image"), uploadImage);

export default router;
