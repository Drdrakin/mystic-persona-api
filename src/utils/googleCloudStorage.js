import sharp from 'sharp';
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

async function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const blob = bucket.file(uniqueFilename);

    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      metadata: {
        cacheControl: 'no-cache'
      }
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      resolve(uniqueFilename);
    });

    // Sharp converts and resizes the image for faster loading and to have a consistent pattern.
    sharp(file.buffer)
      .resize(200, 200)
      .toFormat('webp')
      .toBuffer()
      .then((data) => {
        blobStream.end(data);
      })
      .catch((err) => {
        console.error("Sharp image processing failed:", err.message);
        reject(err);
      });
  });
}

async function getImage(fileName) {

  try {

    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found in cloud storage: " + fileName);
    }

    const [buffer] = await file.download();

    return buffer;
  } catch (err) {
    throw new Error("Error retrieving file from cloud: " + err.message);
  }
}

async function generateSignedUrl(fileName) {
  try {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const [url] = await bucket.file(fileName).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error(`Failed to generate URL for file: ${fileName}`, error.message);
    return null;
  }
}

export default { getImage, generateSignedUrl, uploadImage }; 