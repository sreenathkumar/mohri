"use client";

import React from "react";
import { Label } from "../shadcn/label";

interface FormFieldProps {
    label?: string;
    htmlFor?: string;
    children: React.ReactNode;
    error?: string[];
}

const FormField = ({ label, htmlFor, children, error }: FormFieldProps) => {
    const id = htmlFor || getChildId(children);

    return (
        <div className="self-stretch">
            {label && (
                <Label htmlFor={id} className="text-xs font-bold tracking-wider text-muted-foreground mb-2">
                    {label}
                </Label>
            )}
            {children}
            {
                // Display error message if there is an error
                error?.map((err) => (
                    <p className="text-primary text-sm text-red-500 mt-1" key={err}>
                        {err}
                    </p>
                ))
            }
        </div>
    );
};

// ===============================================================
// Function which returns the id of the child element
// ===============================================================
const getChildId = (children: React.ReactNode): string | undefined => {
    if (!React.isValidElement<{ id: string }>(children)) {
        return undefined;
    }

    return children.props.id ?? undefined;
};

export default FormField;