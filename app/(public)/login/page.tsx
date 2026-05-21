import LoginForm from "./components/LoginForm"

function LoginPage() {

    return (
        <main className="min-h-screen flex items-center justify-center px-4 md:px-0">
            <div className="max-w-md w-full space-y-8 p-8 bg-card/50 text-card-foreground rounded-xl shadow border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold">Sign in to your account</h2>
                </div>
                <LoginForm />
            </div>
        </main>
    )
}


export default LoginPage