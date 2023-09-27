import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
    endpoint: process.env.AWS_URL,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS as string,
        secretAccessKey: process.env.AWS_KEY as string
    }
});