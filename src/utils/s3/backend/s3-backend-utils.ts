import AWS from 'aws-sdk';
import fs from 'fs';

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

export const uploadFileStreamToS3 = async ({
    stream,
    bucket,
    key,
    contentType,
}: {
    stream: fs.ReadStream;
    bucket: string;
    key: string;
    contentType: string;
}): Promise<{ Location: string }> => {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
        // ACL: 'public-read',
    };

    console.log(`[S3-BACK] Upload INIT`);
    console.log(`[S3-BACK] Bucket: ${bucket}`);
    console.log(`[S3-BACK] Key: ${key}`);
    console.log(`[S3-BACK] Content-Type: ${contentType}`);

    try {
        const result = await s3.upload(params).promise();
        console.log(`[S3-BACK] Upload OK: ${result.Location}`);
        return { Location: result.Location };
    } catch (error) {
        console.error(`[S3-BACK] Upload ERROR for key: ${key}`, error);
        throw error;
    }
};

export const deleteFileFromS3 = async ({
    bucket,
    key,
}: {
    bucket: string;
    key: string;
}): Promise<void> => {
    const params = {
        Bucket: bucket,
        Key: key,
    };

    console.log(`[S3-BACK] Delete INIT`);
    console.log(`[S3-BACK] Bucket: ${bucket}`);
    console.log(`[S3-BACK] Key: ${key}`);

    try {
        await s3.deleteObject(params).promise();
        console.log(`[S3-BACK] Delete OK`);
    } catch (error) {
        console.error(`[S3-BACK] Delete ERROR for key: ${key}`, error);
        throw error;
    }
};
