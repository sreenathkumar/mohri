import ResetPasswordForm from "./components/ResetPasswordForm"

function ResetPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="max-w-md w-full space-y-8 p-8 bg-card/50 text-card-foreground rounded-xl shadow border">
                <ResetPasswordForm />
            </div>
        </div>
    )
}

export default ResetPasswordPage