import sharp from 'sharp';
import fs from 'fs';

const cacheDir = './cache/avatars';
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  
export async function composeAvatar({ head, eyes, mouth }) {
  const headBuffer = await getImageFromCloud(head);
  const eyesBuffer = await getImageFromCloud(eyes);
  const mouthBuffer = await getImageFromCloud(mouth);

  return sharp(headBuffer)
    .composite([
      { input: eyesBuffer },
      { input: mouthBuffer }
    ])
    .toBuffer();
}

export async function checkCacheAndCompose({ head, eyes, mouth }) {
  const cacheKey = `${head}-${eyes}-${mouth}.png`;
  const cachePath = `${cacheDir}/${cacheKey}`;

  if (fs.existsSync(cachePath)) {
    return fs.promises.readFile(cachePath);
  }

  const avatarBuffer = await composeAvatar({ head, eyes, mouth });
  await fs.promises.writeFile(cachePath, avatarBuffer);
  return avatarBuffer;
}
