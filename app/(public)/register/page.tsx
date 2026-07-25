import RegisterForm from "./components/register-form"

function RegisterPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 md:px-0">
            <div className="max-w-md w-full space-y-8 p-8 bg-card/50 text-card-foreground rounded-xl shadow-sm border">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold">Create an Account</h2>
                </div>
                <RegisterForm />
            </div>
        </main>
    )
}

export default RegisterPage