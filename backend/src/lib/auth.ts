import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle";
import * as schema from "../db/schema";
import { admin } from "better-auth/plugins";
import { config } from "../config/env";
import { emailService } from "../services/email.service";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, token }) => {
       const verificationUrl = new URL("/auth/reset-password", config.CLIENT_URL);
        verificationUrl.searchParams.set("token", token);
      await emailService.sendPasswordResetEmail({ user, url:verificationUrl.toString() });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,

    sendVerificationEmail: async ({ user, token }) => {
      const verificationUrl = new URL("/auth/verify-email", config.CLIENT_URL);

      verificationUrl.searchParams.set("token", token);

      await emailService.sendEmailVerificationEmail({
        user,
        url: verificationUrl.toString(),
      });
    },
  },
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [admin({ defaultRole: "user" })],
  baseURL: config.BETTER_AUTH_URL,
  trustedOrigins: [config.CLIENT_URL!],
});
