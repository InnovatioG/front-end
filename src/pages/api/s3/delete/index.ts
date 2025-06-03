import { deleteFileFromS3 } from '@/utils/s3/backend/s3-backend-utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    const { bucket, key } = req.body;

    if (!bucket || !key) {
        return res.status(400).json({ error: 'Missing bucket or key' });
    }

    try {
        await deleteFileFromS3({ bucket, key });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Delete failed' });
    }
}
