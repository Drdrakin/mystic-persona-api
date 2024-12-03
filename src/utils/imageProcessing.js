import sharp from 'sharp';

export async function composeAvatar({ head, eyes, mouth }) {
  try {
    // Ensure all inputs are valid PNG files
    const baseImage = await sharp(head).ensureAlpha().toBuffer();

    // Get dimensions of the base image
    const { width, height } = await sharp(baseImage).metadata();

    if (!width || !height) {
      throw new Error("Invalid base image dimensions");
    }

    // Resize eyes and get metadata for positioning
    const resizedEyesBuffer = await sharp(eyes)
      .resize({ width: Math.floor(width * 0.8) }) // Resize to 40% of base image width
      .toBuffer();

    const { width: eyesWidth, height: eyesHeight } = await sharp(resizedEyesBuffer).metadata();

    // Resize mouth and get metadata for positioning
    const resizedMouthBuffer = await sharp(mouth)
      .resize({ width: Math.floor(width * 0.3) }) // Resize to 30% of base image width
      .toBuffer();

    const { width: mouthWidth, height: mouthHeight } = await sharp(resizedMouthBuffer).metadata();

    // Calculate positions for the layers
    const eyesX = Math.floor((width - eyesWidth) / 2);
    const eyesY = Math.floor(height * 0.1);

    const mouthX = Math.floor((width - mouthWidth) / 2);
    const mouthY = Math.floor(height * 0.7);

    // Composite the image with proper positioning
    const composedImage = await sharp(baseImage)
      .composite([
        { input: resizedEyesBuffer, left: eyesX, top: eyesY, blend: 'over' },
        { input: resizedMouthBuffer, left: mouthX, top: mouthY, blend: 'over' },
      ])
      .png()
      .toBuffer();

    return composedImage;
  } catch (error) {
    throw new Error(`Error composing avatar: ${error.message}`);
  }
}
