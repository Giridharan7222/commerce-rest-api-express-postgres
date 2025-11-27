// src/upload.routes.ts

import { Router, Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

dotenv.config();

const uploadRoutes = Router();

// ----------------------
// S3 CLIENT
// ----------------------
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ----------------------
// MULTER
// ----------------------
const upload = multer({ storage: multer.memoryStorage() });

// ----------------------
// S3 UPLOAD FUNCTION
// ----------------------
const uploadFileToS3 = async (
  buffer: Buffer,
  fileName: string,
  mimeType: string,
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: mimeType,
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

// ----------------------
// ROUTE
// ----------------------
uploadRoutes.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded!" });
      }

      const file = req.file;

      const url = await uploadFileToS3(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

      return res.json({
        message: "File uploaded successfully!",
        url,
      });
    } catch (err: any) {
      return res.status(500).json({
        message: "Upload failed",
        error: err.message,
      });
    }
  },
);

export default uploadRoutes;
