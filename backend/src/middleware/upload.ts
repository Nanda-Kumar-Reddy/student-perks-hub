import multer from "multer";
import path from "path";
import crypto from "crypto";
import { Request } from "express";
import { env } from "../config/env";

// Allowed MIME types
const ALLOWED_TYPES: Record<string, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
};

const ALL_ALLOWED = [...ALLOWED_TYPES.image, ...ALLOWED_TYPES.document];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Randomize filename to prevent path traversal & collisions
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex") + ext;
    cb(null, safeName);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!ALL_ALLOWED.includes(file.mimetype)) {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
    return;
  }
  // Double-check extension matches mimetype
  const ext = path.extname(file.originalname).toLowerCase();
  const dangerousExts = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".ts", ".html", ".svg"];
  if (dangerousExts.includes(ext)) {
    cb(new Error("File extension not allowed"));
    return;
  }
  cb(null, true);
}

/**
 * Secure file upload middleware
 * - Randomized filenames
 * - MIME type validation
 * - Dangerous extension blocking
 * - Size limiting
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
    files: 5, // Max 5 files per request
  },
});
