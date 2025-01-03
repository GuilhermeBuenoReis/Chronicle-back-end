import { v2 as cloud } from 'cloudinary';
import { env } from '../env';

export const cloudinary = cloud.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.API_KEY_CLOUDNARY,
  api_secret: env.API_SECRET_CLOUDNARY,
});
