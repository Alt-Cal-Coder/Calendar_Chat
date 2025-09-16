import Joi from "joi";

const envSchema = Joi.object({
  PORT: Joi.number().integer().positive().default(3002),

  BASE_URL: Joi.string().uri().default("http://localhost:3002"),
  PYTHON_API_URL: Joi.string().uri().allow(""),

  LOG_DIR: Joi.string().default("logs"),
  LOG_FORMAT: Joi.string()
    .valid("combined", "common", "short", "tiny")
    .default("combined"),

  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow(''), // Allow empty strings for optional values
  DB_HOST: Joi.string().hostname().required(),
  DB_PORT: Joi.number().integer().positive().required(),
  DB_NAME: Joi.string().required(),

  MAIL_HOST: Joi.string().hostname().default("smtp.gmail.com"),
  MAIL_PORT: Joi.number().integer().positive().default(465),
  MAIL_SECURE: Joi.boolean().default(true),
  MAIL_USER: Joi.string().allow(""),
  MAIL_PASSWORD: Joi.string().allow(""),

  TWILIO_ACCOUNT_SID: Joi.string().allow(""),
  TWILIO_ACCOUNT_AUTH_TOKEN: Joi.string().allow(""),
  TWILIO_ACCOUNT_MOBILE_NO: Joi.string().allow(""),

  UPLOAD_SIZE_LIMIT: Joi.number().integer().positive().default(5 * 1024 * 1024),
  MAX_FILE_COUNT: Joi.number().integer().positive().default(5),
}).unknown(); // Allow unknown keys to avoid errors if additional env variables are added

export const validateEnv = (env) => {
  const { error } = envSchema.validate(env, { allowUnknown: true });
  if (error) {
    throw new Error(`Environment variable validation error: ${error.message}`);
  }
};
