// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// ✅ Ensure .env variables are loaded
dotenv.config();

// ✅ Check if env variables exist
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
  console.error("❌ Cloudinary ENV variables are missing!");
  console.log("Please check your .env file contains:");
  console.log("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET");
} else {
  // ✅ Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log("✅ Cloudinary Connected Successfully:", process.env.CLOUDINARY_CLOUD_NAME);
}

// ✅ Export configured instance
export default cloudinary;
