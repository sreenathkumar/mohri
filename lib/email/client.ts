import nodemailer from 'nodemailer'

const globalForNodemailer = globalThis as unknown as {
    transporter: nodemailer.Transporter
};

const transporter = globalForNodemailer.transporter || nodemailer.createTransport({
    secure: true,
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

if (process.env.NODE_ENV !== 'production') {
    globalForNodemailer.transporter = transporter;
}

export default transporter;