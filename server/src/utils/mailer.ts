import nodemailer from 'nodemailer';
import logger from './logger';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (email: string, token: string) => {
  const confirmationUrl = `${
    process.env.NODE_ENV === 'production'
      ? 'https://monteina.netlify.app'
      : 'http://localhost:5173'
  }/confirm?token=${token}`;
  try {
    await transporter.sendMail({
      from: '"Monteina Management" <no-reply@monteina.com>',
      to: email,
      subject: 'Confirm Your Email',
      html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email.</p>`
    });
    logger.info(`Confirmation email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send confirmation email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Nepavyko išsiųsti patvirtinimo laiško.');
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  try {
    await transporter.sendMail({
      from: '"Monteina Management" <no-reply@monteina.com>',
      to: email,
      subject: 'Slaptažodžio atkūrimas',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Confirm Your Email</h2>
        <p style="text-align: center;">Thank you for signing up! Please confirm your account by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3A7EF9; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Confirm Account</a>
        </div>
        <p style="text-align: center;">If you did not sign up for this account, you can safely ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
        <p style="color: #777; font-size: 12px; text-align: center;">This email was generated automatically. Please do not reply.</p>
      </div>
    `
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Nepavyko išsiųsti slaptažodžio atkūrimo laiško.');
  }
};