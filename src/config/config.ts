import * as z from "zod";

const envVarsSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"]),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().describe("DB Url"),
  VALKEY_URL: z.string().describe("Valkey url"),
  JWT_SECRET: z.string().describe("JWT secret key"),
  JWT_ISSUER: z.string().describe("JWT issuer"),
  JWT_AUDIENCE: z.string().describe("JWT issuer"),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce
    .number()
    .default(30)
    .describe("minutes after which access tokens expire"),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce
    .number()
    .default(30)
    .describe("days after which refresh tokens expire"),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce
    .number()
    .default(10)
    .describe("minutes after which reset password token expires"),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce
    .number()
    .default(10)
    .describe("minutes after which verify email token expires"),
  SMTP_HOST: z.string().describe("server that will send the emails"),
  SMTP_PORT: z.coerce.number().describe("port to connect to the email server"),
  SMTP_USERNAME: z.string().describe("username for email server"),
  SMTP_PASSWORD: z.string().describe("password for email server"),
  EMAIL_FROM: z
    .string()
    .describe("the from field in the emails sent by the app")
});

const data = envVarsSchema.parse(process.env);

export default {
  env: data.NODE_ENV,
  port: data.PORT,
  db_url: data.DATABASE_URL,
  valkey_url: data.VALKEY_URL,
  jwt: {
    iss: data.JWT_ISSUER,
    aud: data.JWT_AUDIENCE,
    secret: data.JWT_SECRET,
    accessExpirationMinutes: data.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: data.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: data.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: data.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES
  },
  email: {
    smtp: {
      host: data.SMTP_HOST,
      port: data.SMTP_PORT,
      auth: {
        user: data.SMTP_USERNAME,
        pass: data.SMTP_PASSWORD
      }
    },
    from: data.EMAIL_FROM
  }
};
