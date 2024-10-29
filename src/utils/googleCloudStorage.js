import { Storage } from '@google-cloud/storage';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = new Storage({
  keyFilename: path.join(__dirname, '../../gcp-credentials.json'),
  projectId: 'vital-domain-436623-b8'
});

const bucketName = 'mystica-dev';
const bucket = storage.bucket(bucketName);

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(uniqueFilename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      resolve(uniqueFilename);
    });

    blobStream.end(file.buffer);
  });
};

export const generateSignedUrl = async (fileName) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 30 * 60 * 1000,
  };

  const [url] = await bucket.file(fileName).getSignedUrl(options);
  return url;
};
