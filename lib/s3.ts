import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getBucketConfig, createS3Client } from "./aws-config";
import { prisma } from "./db";
import { Image as ImageType } from "@prisma/client";

const s3Client = createS3Client();
const { bucketName, folderPrefix } = getBucketConfig();

// Client for signed URLs - uses localhost for frontend access
const s3ClientForSignedUrls = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
  endpoint: "http://localhost:9001",
});

export async function uploadFile(
  buffer: Buffer,
  fileName: string
): Promise<ImageType> {
  const key = `${folderPrefix}uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: getContentType(fileName),
  });

  try {
    await s3Client.send(command);

    const image = await prisma.image.create({
      data: {
        path: key,
        size: buffer.length,
        mimeType: getContentType(fileName),
      },
    });

    return image;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

export async function downloadFile(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const signedUrl = await getSignedUrl(s3ClientForSignedUrls, command, {
      expiresIn: 300, // 5 minutes
    });
    console.log("signedUrl", signedUrl);
    return signedUrl;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Failed to download file");
  }
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

function getContentType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}
