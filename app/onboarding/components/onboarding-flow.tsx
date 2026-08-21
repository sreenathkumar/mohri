"use client";

import { useState } from "react";
import CreateNewOrg from "./create-org-step";
import { Check } from "lucide-react";
import InviteOrgMember from "./invite-member-step";


export default function OnboardingFlow() {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <div className="w-full max-w-lg bg-[#0F172A] text-slate-100 flex flex-col justify-center items-center p-4 font-sans">

      {/* Progress Indicator Header */}
      <div className="w-full  mb-8">
        <div className="flex items-center justify-between px-2">

          {/* Step 1 Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${step >= 1
                ? "bg-[#F97316] border-[#F97316] text-white"
                : "border-slate-700 text-slate-500 bg-slate-900"
                }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span
              className={`text-sm font-medium ${step >= 1 ? "text-white" : "text-slate-500"
                }`}
            >
              Create Organization
            </span>
          </div>

          <div className="flex-1 h-[2px] bg-slate-800 mx-4" />

          {/* Step 2 Indicator */}
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${step === 2
                ? "bg-[#F97316] border-[#F97316] text-white"
                : "border-slate-800 text-slate-500 bg-slate-900"
                }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium ${step === 2 ? "text-white" : "text-slate-500"
                }`}
            >
              Invite Team
            </span>
          </div>

        </div>
      </div>

      {/* Interactive Card */}
      <div className="w-full max-w-lg bg-[#1E293B]/70 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8">

        {step === 1 ? (
          <CreateNewOrg setStep={setStep} />
        ) : (
          <InviteOrgMember />
        )}

      </div>
    </div>
  );
}