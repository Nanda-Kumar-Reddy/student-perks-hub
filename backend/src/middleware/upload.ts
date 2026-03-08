import multer from "multer";
import path from "path";
import { Request } from "express";
import { env } from "../config/env";

// Allowed MIME types
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

const ALL_ALLOWED = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document];

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALL_ALLOWED.includes(file.mimetype)) {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
    return;
  }
  const ext = path.extname(file.originalname).toLowerCase();
  const dangerousExts = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".ts", ".html", ".svg"];
  if (dangerousExts.includes(ext)) {
    cb(new Error("File extension not allowed"));
    return;
  }
  cb(null, true);
}

/**
 * Memory storage — file buffer available as req.file.buffer
 * Used for S3 uploads
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: (env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024,
    files: 5,
  },
});
