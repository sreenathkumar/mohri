'use client';

import { Input } from "@/components/shadcn/input";
import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordField() {
    const [fieldType, setFieldType] = useState('password');
    return (
        <div className="relative">
            <Input id="password" type={fieldType} name="password" required className='w-full px-4 py-3 rounded-xl border border-border text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm' />
            {
                fieldType === 'password' ? <EyeIcon onClick={() => setFieldType('text')} className='absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-300 cursor-pointer' /> : <EyeOff onClick={() => setFieldType('password')} className='absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-300 cursor-pointer' />
            }
        </div>
    )
}


export default PasswordField