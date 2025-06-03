import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { uploadFileStreamToS3 } from '@/utils/s3/backend/s3-backend-utils';

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const form = new IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Form parse error:', err);
            return res.status(500).json({ error: 'Form parse failed' });
        }

        try {
            const file = files.file as any;

            const bucket = Array.isArray(fields.bucket) ? fields.bucket[0] : fields.bucket ?? undefined;
            const key = Array.isArray(fields.key) ? fields.key[0] : fields.key ?? undefined;

            if (!bucket || !key) {
                console.error('[S3-BACK] Missing bucket or key');
                return res.status(400).json({ error: 'Missing bucket or key' });
            }

            const stream = fs.createReadStream(file.filepath);

            const result = await uploadFileStreamToS3({
                stream,
                bucket,
                key,
                contentType: file.mimetype,
            });

            res.status(200).json(result);
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Upload failed' });
        }
    });
}
