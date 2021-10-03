export const constructB2Url = ({
  bucketName,
  fileNameKey,
}: {
  bucketName: string;
  fileNameKey: string;
}): string => {
  return `https://${bucketName}.s3.${process.env.AWS_REGION}.backblazeb2.com/${fileNameKey}`;
};

// Url must be in the format defined in constructB2Url function
export const extractFileKeyFromUrl = (url: string): string => {
  return url.split(".backblazeb2.com/")[1];
};
