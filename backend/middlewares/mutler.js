import multer from "multer";

// Set up memory storage for multer
const storage = multer.memoryStorage();
export const singleUpload = multer({ storage }).single("file");