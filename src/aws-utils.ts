import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const defaultClient = new S3Client({
  endpoint: `https://${process.env.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "auto",
});

export function fetchSignedUrl(key: string): Promise<string> {
  return getSignedUrl(
    defaultClient,
    new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key }),
    { expiresIn: 3600 }
  );
}

export async function deleteObject(key: string) {
  await defaultClient.send(
    new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: key })
  );
}
