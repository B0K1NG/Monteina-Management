import nodemailer from 'nodemailer';
import logger from './logger';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const styledEmailTemplate = (
  title: string,
  message: string,
  ctaText: string,
  ctaLink: string
) => `
  <div style="background-color: #f5f5f5; padding: 20px;">
    <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; font-family: Arial, sans-serif;">
      <tr>
        <td style="background-color: #3A7EF9; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Monteina Management</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px;">
          <h2 style="color: #333;">${title}</h2>
          <p style="color: #555; line-height: 1.6;">${message}</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${ctaLink}" style="background-color: #3A7EF9; color: white; padding: 14px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
              ${ctaText}
            </a>
          </div>
          <p style="color: #999; font-size: 12px; text-align: center;">
            Jei šio el. laiško nelaukėte - galite jį ignoruoti.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #888;">
          © ${new Date().getFullYear()} Monteina. Visos teisės saugomos.
        </td>
      </tr>
    </table>
  </div>
`;

export const sendConfirmationEmail = async (email: string, token: string) => {
  const confirmationUrl = `${
    process.env.NODE_ENV === 'production'
      ? 'https://monteina.netlify.app'
      : 'http://localhost:5173'
  }/confirm?token=${token}`;

  const html = styledEmailTemplate(
    'Patvirtinkite el. paštą',
    'Dėkojame, kad prisiregistravote. Paspauskite mygtuką, kad patvirtintumėte savo el. pašto adresą.',
    'Patvirtinti paskyrą',
    confirmationUrl
  );

  try {
    await transporter.sendMail({
      from: '"Monteina Management" <no-reply@monteina.com>',
      to: email,
      subject: 'Patvirtinkite savo el. paštą',
      html,
    });
    logger.info(`Confirmation email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send confirmation email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Nepavyko išsiųsti patvirtinimo laiško.');
  }
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
  const html = styledEmailTemplate(
    'Slaptažodžio atkūrimas',
    'Panašu, kad pamiršote slaptažodį. Paspauskite mygtuką žemiau, kad nustatytumėte naują slaptažodį.',
    'Atkurti slaptažodį',
    resetUrl
  );

  try {
    await transporter.sendMail({
      from: '"Monteina Management" <no-reply@monteina.com>',
      to: email,
      subject: 'Slaptažodžio atkūrimo nuoroda',
      html,
    });
    logger.info(`Password reset email sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send password reset email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw new Error('Nepavyko išsiųsti slaptažodžio atkūrimo laiško.');
  }
};