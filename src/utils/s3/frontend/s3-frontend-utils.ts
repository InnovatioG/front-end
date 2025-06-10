import { toJson } from 'smart-db';

export const apiUploadFileToS3 = async (file: File, bucketName: string, key: string): Promise<{ Location: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucketName);
    formData.append('key', key);

    console.log(`[S3-FRONT] Upload INIT - key: ${key}`);
    console.log(`[S3-FRONT] File name: ${file.name}, type: ${file.type}, size: ${file.size}`);
    console.log(`[S3-FRONT] Bucket: ${bucketName}`);

    const response = await fetch('/api/s3/upload', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`[S3-FRONT] Upload ERROR - key: ${key} - Status: ${response.status} - Text: ${text}`);
        throw new Error(`Failed to upload file to S3: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`[S3-FRONT] Upload OK - key: ${key} - Response: ${toJson(result)}`);
    return result;
};

export const apiDeleteFileFromS3 = async (bucketName: string, key: string): Promise<void> => {
    console.log(`[S3-FRONT] Delete INIT - bucket: ${bucketName}, key: ${key}`);

    const response = await fetch('/api/s3/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bucket: bucketName, key }),
    });

    if (!response.ok) {
        const text = await response.text();
        console.error(`[S3-FRONT] Delete ERROR - key: ${key} - Status: ${response.status} - Text: ${text}`);
        throw new Error(`Failed to delete file from S3: ${response.statusText}`);
    }

    console.log(`[S3-FRONT] Delete OK - key: ${key}`);
};

export const apiUploadBlobURLToS3 = async (blobUrl: string): Promise<string> => {
    console.log(`[S3-FRONT] Converting BlobURL to File: ${blobUrl}`);
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    const mimeType = blob.type;
    const fileExtension = mimeType.split('/')[1];
    const validExtensions = ['png', 'jpeg', 'jpg', 'webp', 'gif'];
    const extension = validExtensions.includes(fileExtension) ? fileExtension : 'png';

    const file = new File([blob], `avatar-${Date.now()}.${extension}`, { type: mimeType });

    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || 'innovatio-assets';
    const folder = process.env.NEXT_PUBLIC_AWS_BUCKET_AVATARS_FOLDER || 'avatars';
    const key = `${folder}/avatar-${Date.now()}.${extension}`;

    console.log(`[S3-FRONT] Uploading Blob File - key: ${key}, type: ${mimeType}, size: ${file.size}, extension: ${extension}, bucket: ${bucketName}`);

    const result = await apiUploadFileToS3(file, bucketName, key);
    return result.Location;
};
