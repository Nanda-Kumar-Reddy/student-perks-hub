/**
 * Storage Wrapper
 * Abstracts file storage. Currently uses AWS S3.
 * Swap this wrapper to migrate to GCS, Azure Blob, or local storage.
 */
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";
import { env } from "../config/env";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_FILE_SIZE = (env.MAX_FILE_SIZE_MB || 10) * 1024 * 1024;

class StorageWrapper {
  private s3: S3Client | null = null;
  private bucket: string;

  constructor() {
    this.bucket = env.AWS_S3_BUCKET || "";
    if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_REGION) {
      this.s3 = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  /**
   * Upload a file buffer to S3
   * Returns the public URL of the uploaded file
   */
  async upload(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: string = "uploads"
  ): Promise<string> {
    this.validateFile(originalName, mimeType, fileBuffer.length);

    if (!this.s3) {
      throw new Error("Storage not configured. Set AWS credentials in environment.");
    }

    const ext = path.extname(originalName).toLowerCase();
    const key = `${folder}/${crypto.randomBytes(16).toString("hex")}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: mimeType,
      })
    );

    return `https://${this.bucket}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Upload a Multer file object to S3
   */
  async uploadMulterFile(
    file: Express.Multer.File,
    folder: string = "uploads"
  ): Promise<string> {
    return this.upload(file.buffer, file.originalname, file.mimetype, folder);
  }

  /**
   * Delete a file from S3 by its key or full URL
   */
  async deleteFile(fileUrlOrKey: string): Promise<void> {
    if (!this.s3) {
      throw new Error("Storage not configured");
    }

    let key = fileUrlOrKey;
    if (fileUrlOrKey.startsWith("http")) {
      const url = new URL(fileUrlOrKey);
      key = url.pathname.slice(1); // remove leading /
    }

    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      })
    );
  }

  /**
   * Generate a presigned URL for temporary access
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this.s3) {
      throw new Error("Storage not configured");
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn });
  }

  /**
   * Check if storage is configured
   */
  isConfigured(): boolean {
    return this.s3 !== null;
  }

  // ── Validation ─────────────────────────────────────

  private validateFile(originalName: string, mimeType: string, size: number): void {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new Error(`File type "${mimeType}" is not allowed`);
    }

    if (size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${env.MAX_FILE_SIZE_MB || 10}MB limit`);
    }

    const ext = path.extname(originalName).toLowerCase();
    const dangerous = [".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".ts", ".html", ".svg"];
    if (dangerous.includes(ext)) {
      throw new Error(`File extension "${ext}" is not allowed`);
    }
  }
}

export const storage = new StorageWrapper();
