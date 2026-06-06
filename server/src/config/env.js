import dotenv from 'dotenv';

dotenv.config();

const rawClientUrl = process.env.CLIENT_URL ?? 'http://localhost:5173,http://127.0.0.1:5173';
const CLIENT_URLS = rawClientUrl
  .split(',')
  .map((u) => u.trim())
  .filter((u) => u.startsWith('http'));

if (process.env.NODE_ENV !== 'production') {
  console.log('[env] Allowed CORS origins:', CLIENT_URLS);
}

export const env = {
  NODE_ENV:                process.env.NODE_ENV ?? 'development',
  PORT:                    Number(process.env.PORT ?? 5000),
  MONGODB_URI:             process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/smartpark',
  SKIP_DB_CONNECT:         process.env.SKIP_DB_CONNECT === 'true',
  JWT_SECRET:              process.env.JWT_SECRET ?? 'development_secret_change_me',
  JWT_EXPIRES_IN:          process.env.JWT_EXPIRES_IN ?? '7d',
  CLIENT_URLS,
  AUTH_DEBUG:              process.env.AUTH_DEBUG === 'true',
  CLOUDINARY_CLOUD_NAME:   process.env.CLOUDINARY_CLOUD_NAME ?? '',
  CLOUDINARY_API_KEY:      process.env.CLOUDINARY_API_KEY ?? '',
  CLOUDINARY_API_SECRET:   process.env.CLOUDINARY_API_SECRET ?? '',
  CLOUDINARY_FOLDER:       process.env.CLOUDINARY_FOLDER ?? 'smartpark/parkings',
  RAZORPAY_KEY_ID:         process.env.RAZORPAY_KEY_ID ?? '',
  RAZORPAY_KEY_SECRET:     process.env.RAZORPAY_KEY_SECRET ?? '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET ?? '',
  ALLOW_TEST_PAYMENT:      process.env.ALLOW_TEST_PAYMENT === 'true',
  TEST_COUPON_CODE:        process.env.TEST_COUPON_CODE ?? '',
  GOOGLE_CLIENT_ID:        process.env.GOOGLE_CLIENT_ID ?? '',
  GROQ_API_KEY:       process.env.GROQ_API_KEY ?? '',
};