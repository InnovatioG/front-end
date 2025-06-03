import AWS from 'aws-sdk';

// Configura el SDK de AWS con tus credenciales y la región de tu bucket S3
AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadFileToS3 = async (file: File, bucketName: string, key: string) => {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
    };

    try {
        console.log(`File uploading to S3: ${key}`);
        const data = await s3.upload(params).promise();
        console.log(`File uploaded to S3: ${key}`);
        return data.Location;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export const deleteFileFromS3 = async (bucketName: string, key: string) => {
    const params = { Bucket: bucketName, Key: key };
    try {
        console.log(`File deleteting from S3: ${key}`);
        await s3.deleteObject(params).promise();
        console.log(`File deleted from S3: ${key}`);
    } catch (error) {
        console.error(`Error deleting file from S3: ${key}`, error);
        throw error;
    }
};

export const uploadBlobURLToS3 = async (blobUrl: string): Promise<string> => {
    try {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        // Get the file extension from the MIME type
        const mimeType = blob.type; // Example: "image/jpeg"
        const fileExtension = mimeType.split("/")[1]; // Extracts "jpeg", "png", etc.

        // Ensure a valid file extension (fallback to 'png' if unknown)
        const validExtensions = ["png", "jpeg", "jpg", "webp", "gif"];
        const extension = validExtensions.includes(fileExtension) ? fileExtension : "png";

        // Create a File object with the correct extension
        const file = new File([blob], `avatar-${Date.now()}.${extension}`, { type: mimeType });

        const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!;
        const key = `avatars/avatar-${Date.now()}.${extension}`;

        return await uploadFileToS3(file, bucketName, key);
    } catch (error) {
        console.error("Error converting Blob to File for S3 upload:", error);
        throw error;
    }
};
