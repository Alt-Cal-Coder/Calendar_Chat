// middlewares/multerMiddleware.js
import multer from "multer";
import config from "../config/index.js";

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder as per file type
    if (file.mimetype.includes("image")) {
      cb(null, `./public/uploads/images`);
    } else if (file.mimetype.includes("video")) {
      cb(null, `./public/uploads/videos`);
    } else {
      cb(null, `./public/uploads/others`); // Specify the destination folder
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix);
  },
});

// Create a multer instance with storage and file filter
const upload = multer({
  storage,
  limits: { fileSize: config.multer.uploadSizeLimit }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      // "application/pdf",
      // "text/csv",
      // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      // "audio/mpeg",
      // "audio/mp3",
      // "audio/ogg",
      // "audio/wav",
      // "audio/webm",
      // "video/webm",
      // "video/ogg",
      // "video/mp4",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(
        new Error("Invalid file type. Only JPEG, PNG files are allowed."),
        false
      );
    }
  },
});

// Middleware for single file upload
export const uploadSingle = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      return next(err);
    }
    // Ensure there's a file and attach it to req.uploadedFile
    if (req.file) {
      req.uploadedFile = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        createdAt: Date.now(), // Add timestamp for uniqueness
      };
    }
    next(); // Pass control to the next middleware
  });
};

// Middleware for multiple file uploads
export const uploadMultiple = (req, res, next) => {
  upload.fields([
    { name: "files", maxCount: config.multer.maxFileCount }, // Handle multiple file uploads
    { name: "groupImage", maxCount: 1 }, // Handle single image upload
  ])(req, res, (err) => {
    if (err) {
      return next(err);
    }

    // Ensure files are attached correctly
    req.uploadedFiles = [];

    if (req.files?.files) {
      req.uploadedFiles = req.files.files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        createdAt: Date.now(),
      }));
    }

    if (req.files?.groupImage && req.files.groupImage.length > 0) {
      req.uploadedGroupImage = {
        originalName: req.files.groupImage[0].originalname,
        filename: req.files.groupImage[0].filename,
        path: req.files.groupImage[0].path,
        mimetype: req.files.groupImage[0].mimetype,
        createdAt: Date.now(),
      };
    }

    next();
  });
};
