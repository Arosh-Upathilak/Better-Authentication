import z from "zod";
import "dotenv/config";
import { ValidationError } from "../errors";

const envSchema = z.object({
  PORT: z.string().default("5000"),
  CLIENT_URL:z.url("CLIENT_URL is required"),
  DATABASE_URL:z.url("DATABASE_URL is required"),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL is required"),
  BETTER_AUTH_SECRET:z.string("BETTER_AUTH_SECRET is required"),
  SMTP_SERVER_HOST:z.string("SMTP_SERVER_HOST is required"),
  SMTP_SERVER_PORT:z.string("SMTP_SERVER_PORT is required"),
  SMTP_SERVER_USERNAME:z.string("SMTP_SERVER_USERNAME is required"),
  SMTP_SERVER_PASSWORD:z.string("SMTP_SERVER_PASSWORD is required"),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  throw new ValidationError(
    "Invalid .env file configuration",
    envParse.error.issues,
  );
}

export const config = envParse.data;
