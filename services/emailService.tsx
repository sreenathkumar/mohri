import transporter from "@/lib/email/client";
import { render } from "react-email";
import VerifyEmailTemplate from "@/lib/email/templates/email-verification";
import SendResetPasswordEmail from "@/lib/email/templates/password-reset";

export async function sendVerificationEmail({ to, verificationLink, userName }: { to: string, verificationLink: string, userName: string }) {
    try {
        const emailHtml = await render(<VerifyEmailTemplate name={userName} verificationLink={verificationLink} />);

        // transport the email
        await transporter.sendMail({
            from: `OpsCommerce <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Please verify your email address',
            html: emailHtml
        })
    } catch (error: any) {
        console.log('error in sendVerificationEmail: ', error.message);
    }
}

export async function sendResetPasswordEmail({ to, resetLink, userName }: { to: string, resetLink: string, userName: string }) {
    try {
        const emailHtml = await render(<SendResetPasswordEmail name={userName} url={resetLink} />);

        // transport the email
        await transporter.sendMail({
            from: `OpsCommerce <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Reset your password for OpsCommerce',
            html: emailHtml
        })
    } catch (error: any) {
        console.log('error in sendResetPasswordEmail: ', error.message);
    }
}