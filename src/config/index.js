import dotenv from "dotenv";
import { validateEnv } from "./validateEnv.js";

dotenv.config({ path: ".env" });
validateEnv(process.env);
export default {
  port: process.env.PORT || 3002,
  baseUrl: process.env.BASE_URL || "http://localhost:3002",
  pythonBaseUrl: process.env.PYTHON_BASE_URL || "",
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    service: process.env.MAIL_SERVICE,
    fromEmail: process.env.MAIL_FROM_EMAIL,
    fromName: process.env.MAIL_FROM_NAME,
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_ACCOUNT_AUTH_TOKEN,
    accountMobileNo: process.env.TWILIO_ACCOUNT_MOBILE_NO,
  },
  logs: {
    dir: process.env.LOGS_DIR || "logs",
    format: process.env.LOGS_FORMAT || "combined",
  },
  multer: {
    uploadSizeLimit: process.env.UPLOAD_SIZE_LIMIT || 5 * 1024 * 1024,
    maxFileCount: process.env.MAX_FILE_COUNT || 5,
  }
};
