import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid file format",
      });
    }

    // ✅ Multer already uploaded file to Cloudinary, so:
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path, // Cloudinary URL (auto-returned by multer-storage-cloudinary)
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
