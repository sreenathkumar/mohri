'use client'

import { Button } from "@/components/shadcn/button"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/shadcn/dialog"
import { useActionState, useEffect, useState } from "react";
import FormField from "@/components/ui/CustomField";
import { Input } from "@/components/shadcn/input";
import { updateDriverProfile } from "@/actions/driverActions";
import SubmitBtn from "@/app/(public)/login/components/SubmitBtn";

const init = {
    success: false,
    message: ''
}

function DriverProfileSetting() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [state, updateProfile] = useActionState(updateDriverProfile, init);
    const [showMessage, setShowMessage] = useState(false);

    // const handleAccountDeletion = async () => {
    //     //send request to delete the account
    //     const res = true;

    //     if (res) {
    //         toast.success("Account removal request sent successfully. We will process your request and notify you once it's completed.");
    //         await authClient.signOut();
    //         router.push('/')
    //     } else {
    //         toast.error("Failed to send account removal request. Please try again later.");
    //     }
    // }

    useEffect(() => {
        if (state.success && state.message) {
            setShowMessage(true);

            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 3000)

            return () => clearTimeout(timer)
        }


    }, [state])

    return (
        <section className="px-4 mt-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Settings</h2>
            <div className="space-y-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full px-4 py-3 bg-card/50 hover:bg-card border border-border/40 hover:border-border/80 rounded-lg text-sm font-semibold text-foreground transition-all duration-200 active:scale-95">
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-white/[0.08] backdrop-blur-2xl bg-white/70 dark:bg-card/40 shadow-2xl overflow-hidden gap-0">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        <DialogHeader className="mb-8 relative z-10 text-center">
                            <DialogTitle className="text-2xl font-extrabold text-foreground tracking-tight text-center">Edit Profile</DialogTitle>
                            <DialogDescription className="text-muted-foreground text-sm text-center leading-relaxed">
                                Update your profile information.
                            </DialogDescription>
                        </DialogHeader>
                        <form action={updateProfile} className="space-y-6">
                            {(state.message && showMessage) && (
                                <div className={`px-4 py-3 rounded-lg text-sm font-semibold ${state.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {state.message}
                                </div>
                            )}
                            <FormField htmlFor="full-name" label="Full Name">
                                <Input name="name" type="text" placeholder="Jhone Doe" className="w-full px-4 py-3 border border-border/40 rounded-lg text-sm text-foreground transition-all duration-200 active:scale-95" id="full-name" autoComplete="name" />
                            </FormField>
                            <FormField htmlFor="phone" label="Phone Number">
                                <Input name="phone" type="text" placeholder="+123 09876543" className="w-full px-4 py-3 border border-border/40 rounded-lg text-sm  text-foreground transition-all duration-200 active:scale-95" id="phone" autoComplete="mobile tel" />
                            </FormField>
                            <FormField htmlFor="address" label="Full Address">
                                <Input name="address" type="text" placeholder="House number, city, State" className="w-full px-4 py-3 border border-border/40 rounded-lg text-sm  text-foreground transition-all duration-200 active:scale-95" id="address" autoComplete="name" />
                            </FormField>

                            <SubmitBtn text="Update Profile" loadingText="Updating Profile ..." />
                        </form>
                    </DialogContent>
                </Dialog>
                {/* <Button
                    onClick={handleAccountDeletion}
                    className="w-full px-4 py-3 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 hover:border-destructive/50 rounded-lg text-sm font-semibold text-destructive transition-all duration-200 active:scale-95">
                    Delete the Account
                </Button> */}
            </div>
        </section>
    )
}

export default DriverProfileSetting