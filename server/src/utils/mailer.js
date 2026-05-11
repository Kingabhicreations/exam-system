// Thin nodemailer wrapper. Falls back to console logging if SMTP isn't configured.
import nodemailer from 'nodemailer';

let transporter = null;
if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

export async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log(`[mailer:disabled] To:${to} Subject:${subject}\n${text || html}`);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@exam.local',
    to,
    subject,
    html,
    text,
  });
}
