import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendConfirmationEmail = async (email: string, token: string) => {
  const confirmationUrl = `http://localhost:5173/confirm?token=${token}`;
  await transporter.sendMail({
    from: '"Monteina Management" <no-reply@monteina.com>',
    to: email,
    subject: 'Confirm Your Email',
    html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email.</p>`,
  });
};