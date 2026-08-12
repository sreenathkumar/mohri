import ErrorView from "./components/error-view";
import NewPasswordForm from "./components/new-password-view";
import RequestPasswordReset from "./components/request-password-view";

interface ResetPasswordPageProps {
    searchParams: {
        token?: string;
        error?: string;
    }
}

async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { token, error } = await searchParams;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full space-y-8 p-8 bg-card/50 text-card-foreground rounded-xl shadow-sm border">
                {
                    token ? <NewPasswordForm /> : error ? <ErrorView /> : <RequestPasswordReset />
                }
            </div>
        </div>
    )
}

export default ResetPasswordPage