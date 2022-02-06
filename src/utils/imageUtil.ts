import sharp from 'sharp';

const base64Regex = /^data:([A-Za-z-+\/]+);base64,(.+)$/;
const strToBuffer = (imageData: string) => {
  const matches = imageData.match(base64Regex);
  return Buffer.from(matches?.[2] ?? imageData, 'base64');
};

export const uploadImage = (imageData: string, feedItemId: string) => {
  const image = sharp(strToBuffer(imageData));
  // TODO Upload somewhere
  throw new Error('Not implemented yet');
};
