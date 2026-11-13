import nodemailer from "nodemailer";
import { config } from "../config/env";
import { ValidationError } from "../errors";

type SendEmailType = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type sendEmailVerificationEmailType = {
  user: {
    name: string;
    email: string;
  };
  url: string;
};

export interface IEmailService {
  sendWelcomeEmail(user: { name: string; email: string }): Promise<void>;
  sendEmailVerificationEmail({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void>;
  sendDeleteAccountVerificationEmail({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void>;
  sendPasswordResetEmail({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void>;
}

export class EmailService implements IEmailService {
  private sendEmail = async ({ to, subject, text, html }: SendEmailType) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: config.SMTP_SERVER_HOST,
      port: config.PORT,
      secure: true,
      auth: {
        user: config.SMTP_SERVER_USERNAME,
        pass: config.SMTP_SERVER_PASSWORD,
      },
    });
    try {
      await transporter.verify();
      await transporter.sendMail({
        from: config.SMTP_SERVER_USERNAME,
        to: to,
        subject: subject,
        text: text,
        html: html ? html : "",
      });
    } catch (error) {
      console.error("Email sending failed:", error);
      throw new ValidationError("transporter configuration error");
    }
  };

  public sendWelcomeEmail = async (user: {
    name: string;
    email: string;
  }): Promise<void> => {
    await this.sendEmail({
      to: user.email,
      subject: "Welcome to Our App!",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Our App!</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up for our app! We're excited to have you on board.</p>
        <p>Best regards,
        <br>
        Your App Team</p>
      </div>
    `,
      text: `Hello ${user.name},\n\nThank you for signing up for our app! We're excited to have you on board.\n\nBest regards,\nYour App Team`,
    });
  };

  public sendEmailVerificationEmail = async ({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void> => {
    await this.sendEmail({
      to: user.email,
      subject: "Verify your email address",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Verify Your Email</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Verify Email</a>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
      text: `Hello ${user.name},\n\nThank you for signing up! Please verify your email address by clicking this link: ${url}\n\nIf you didn't create an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    });
  };

  public sendDeleteAccountVerificationEmail = async ({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void> => {
    await this.sendEmail({
      to: user.email,
      subject: "Delete your account",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Confirm Account Deletion</h2>
        <p>Hello ${user.name},</p>
        <p>We're sorry to see you go! Please confirm your account deletion by clicking the button below:</p>
        <a href="${url}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Confirm Deletion</a>
        <p>If you don't have an account, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
      text: `Hello ${user.name},\n\nWe're sorry to see you go! Please confirm your account deletion by clicking this link: ${url}\n\nIf you don't have an account, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    });
  };

  public sendPasswordResetEmail = async ({
    user,
    url,
  }: sendEmailVerificationEmailType): Promise<void> => {
    await this.sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 16px 0;">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>Your App Team</p>
      </div>
    `,
      text: `Hello ${user.name},\n\nYou requested to reset your password. Click this link to reset it: ${url}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in 24 hours.\n\nBest regards,\nYour App Team`,
    });
  };
}
export const emailService = new EmailService();
