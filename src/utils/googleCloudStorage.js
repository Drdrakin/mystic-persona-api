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

export const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
      const uniqueFilename = `${uuidv4()}-${file.originalname}`;
      const blob = bucket.file(uniqueFilename);

      const blobStream = blob.createWriteStream({
          resumable: false,
          contentType: file.mimetype,
          metadata: {
              cacheControl: 'public, max-age=31536000'
          }
      });

      blobStream.on('error', (err) => {
          reject(err);
      });

      blobStream.on('finish', () => {
          resolve(uniqueFilename);
      });

      // Sharp converts and resizes the image for faster loading and to have a 'pattern' of sorts..
      // webp seems more compatible with web apps
      sharp(file.buffer)
          .resize(200, 200)
          .toFormat('webp')
          .toBuffer()
          .then(data => {
              blobStream.end(data);
          })
          .catch(err => {
              reject(err);
          });
  });
};

export const getImageFromCloud = async (fileName) => {
  try {
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      throw new Error("File not found in cloud storage:" + fileName);
    }

    //Download to use locally
    const [buffer] = await file.download();

    return buffer;
  } catch (err) {
    throw new Error("Error retrieving file from cloud:" + err.message);
  }
};

export const generateSignedUrl = async (fileName) => {
  try {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 30 * 60 * 1000,
    };
  
    const [url] = await bucket.file(fileName).getSignedUrl(options);
    return url;
  } catch (error) {
    console.error(`Failed to generate URL for ${part.imageUrl}:`, error.message);
    return null;
  }
};
