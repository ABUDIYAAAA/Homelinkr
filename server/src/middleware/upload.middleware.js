import multer from "multer";
import path from "path";
import fs from "fs";
import { ApiError } from "../utils/api-error.js";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper function to generate public URL
const generatePublicUrl = (filename) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:8000";
  return `${baseUrl}/uploads/${filename}`;
};

// Helper function to save base64 image
const saveBase64Image = (base64String, prefix = "image") => {
  if (!base64String || !base64String.startsWith("data:image/")) {
    return null;
  }

  try {
    const matches = base64String.match(
      /^data:image\/([a-zA-Z+]+);base64,(.+)$/
    );
    if (!matches || matches.length !== 3) {
      throw new Error("Invalid base64 image format");
    }

    const extension = matches[1] === "jpeg" ? "jpg" : matches[1];
    const base64Data = matches[2];
    const filename = `${prefix}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, base64Data, "base64");

    return {
      filename,
      path: filepath,
      publicUrl: generatePublicUrl(filename),
    };
  } catch (error) {
    console.error("Error saving base64 image:", error);
    return null;
  }
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  },
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only image files (JPEG, PNG, WebP) are allowed"),
      false
    );
  }
  cb(null, true);
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 3, // Max 3 files (1 thumbnail + 2 images)
  },
});

// Main upload middleware - handles both multipart and base64
export const handlePropertyUpload = (req, res, next) => {
  // First try multipart upload
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 2 },
  ])(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "File size too large. Maximum 5MB per file.",
          });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Too many files. Maximum 3 files allowed.",
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }

    // Process any base64 images from propertyInfo
    try {
      const { propertyInfo } = req.body;

      if (propertyInfo?.thumbnail?.[0] && !req.files?.thumbnail) {
        const thumbnailFile = saveBase64Image(
          propertyInfo.thumbnail[0],
          "thumbnail"
        );
        if (thumbnailFile) {
          if (!req.files) req.files = {};
          req.files.thumbnail = [thumbnailFile];
        }
      }

      if (propertyInfo?.images?.length && !req.files?.images) {
        const processedImages = [];
        propertyInfo.images.forEach((image, index) => {
          if (image) {
            const imageFile = saveBase64Image(image, `image-${index}`);
            if (imageFile) {
              processedImages.push(imageFile);
            }
          }
        });

        if (processedImages.length > 0) {
          if (!req.files) req.files = {};
          req.files.images = processedImages;
        }
      }

      // Add public URLs to uploaded files
      if (req.files) {
        Object.keys(req.files).forEach((fieldName) => {
          req.files[fieldName] = req.files[fieldName].map((file) => ({
            ...file,
            publicUrl: file.publicUrl || generatePublicUrl(file.filename),
          }));
        });
      }

      next();
    } catch (error) {
      console.error("Error processing images:", error);
      return res.status(500).json({
        success: false,
        message: "Error processing uploaded images",
      });
    }
  });
};

// Validation middleware
export const validatePropertyUpload = (req, res, next) => {
  if (!req.files?.thumbnail?.[0]) {
    return res.status(400).json({
      success: false,
      message: "Thumbnail image is required.",
    });
  }
  next();
};
