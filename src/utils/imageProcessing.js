import sharp from 'sharp';

export async function composeAvatar({ head, eyes, mouth }) {
  return sharp(head)
    .composite([
      { input: eyes },
      { input: mouth }
    ])
    .toBuffer();
}
