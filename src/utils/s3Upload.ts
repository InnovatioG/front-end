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
        const data = await s3.upload(params).promise();
        console.log(data.Location);
        return data.Location;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};
