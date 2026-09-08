'use client'

import FormField from "@/components/ui/CustomField";
import { ArrowRight, Building2 } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

import { createOrganization } from "@/actions/userActions";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useDebounce } from "@/hooks/useDebounce";
import { authClient, useSession } from "@/lib/auth-client";
import TimezoneSelect, { ITimezone } from "react-timezone-select";
import { toast } from "sonner";

interface CreateNewOrgProps {
    setStep: Dispatch<SetStateAction<1 | 2>>
}

function CreateNewOrg({ setStep }: CreateNewOrgProps) {
    const { data: session } = useSession();

    console.log('sesson in create org view: ', session);
    //Organization Setup
    const [orgName, setOrgName] = useState("");
    const [orgSlug, setOrgSlug] = useState("");
    const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [isSlugExist, setIsSlugExists] = useState(false);

    // Auto-generate slug from organization name
    const handleNameChange = (name: string) => {
        setOrgName(name);
        setOrgSlug(
            name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
        );
    };

    //delayed function to check the org slug
    const deboucedCheckSlug = useDebounce(async (text: string) => {
        const { data } = await authClient.organization.checkSlug({
            slug: text
        });

        if (!data) {
            setIsSlugExists(true);
        } else {
            setIsSlugExists(false)
        }
    }, 500)

    //check the slug existence
    const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        setOrgSlug(text);

        //call the slug check function
        deboucedCheckSlug(text);
    }

    // handle the create organization button
    const handleCreateOrg = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!orgName.trim()) return;

        const formData = new FormData(e.currentTarget)

        try {
            const result = await createOrganization(formData);

            if (result.success) {
                await authClient.organization.setActive({
                    organizationId: result.orgId
                });

                setStep(2);//optimistic update;
                toast.success(result.message)
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Failed to create organization:", error);
        }
    };

    return (
        <form onSubmit={handleCreateOrg} className="space-y-6">
            <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-[#F97316]" />
                </div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                    Create Your Organization
                </h1>
                <p className="text-sm text-slate-400">
                    Set up a workspace for your team and manage orders.
                </p>
            </div>

            <div className="space-y-6">
                <FormField htmlFor="orgName" label="Organization/Company/Business Name">
                    <Input
                        id="orgName"
                        type="text"
                        required
                        placeholder="Acme Corp"
                        name="orgName"
                        value={orgName}
                        onChange={(e: any) => handleNameChange(e.target.value)}
                        className="bg-muted/70 border-border"
                    />
                </FormField>

                <FormField htmlFor="orgSlug" label="Workspace URL Slug" error={isSlugExist ? ["This slug is already taken. Please choose another one."] : []}>
                    <Input
                        id="orgSlug"
                        type="text"
                        required
                        placeholder="lowercase-slug-here"
                        name="orgSlug"
                        value={orgSlug}
                        onChange={handleSlugChange}
                        className="bg-muted/70 border-border"
                    />
                </FormField>

                <FormField htmlFor="business-timezone" label="Business Timezone">
                    <TimezoneSelect
                        instanceId='timezone-select'
                        id="business-timezone"
                        name="timezone"
                        value={selectedTimezone}
                        onChange={setSelectedTimezone}
                        className="rounded-lg"
                        classNamePrefix='opscom-tz-select'
                    />
                </FormField>
            </div>


            <Button
                disabled={isSlugExist}
                type="submit"
                className="w-full py-3 px-4 mt-8 bg-primary hover:bg-primary/70 disabled:opacity-50 disabled:hover:bg-[#F97316] text-white font-medium text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
                Continue to Team Setup
                <ArrowRight className="w-4 h-4" />
            </Button>
        </form>
    )
}

export default CreateNewOrg