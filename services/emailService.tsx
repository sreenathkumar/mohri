import transporter from "@/lib/email/client";
import VerifyEmailTemplate from "@/lib/email/templates/email-verification";
import { render } from "react-email";

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