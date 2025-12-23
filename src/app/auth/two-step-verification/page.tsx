"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useVerifyotpMutation } from "@/lib/feature/auth/authThunk";

const TwoStepVerification: React.FC = () => {
  const router = useRouter();
  const [codes, setCodes] = useState<string[]>(Array(6).fill(""));
  const [verifyotp, { isLoading }] = useVerifyotpMutation();

  // Auto-focus first input when component mounts
  useEffect(() => {
    const firstInput = document.getElementById("code-0");
    firstInput?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Move to next input automatically
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = codes.join("");
    const email = localStorage.getItem("VerfiyEmail") || "";

    if (!email) {
      toast.error("Email not found. Please register again.");
      router.push("/auth/signup");
      return;
    }

    if (fullCode.length < 6) {
      toast.error("⚠️ Please enter a 6-digit code.");
      return;
    }

    try {
     const response = await verifyotp({ email, otp: fullCode }).unwrap();

     console.log(response);
     

      toast.success("✅ Verification successful!");
      localStorage.setItem("IsAuthenticate", "true");
      localStorage.removeItem("VerfiyEmail");
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("❌ Invalid or expired OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f15] px-4">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-md bg-[#181e26] border border-[#2a323f] rounded-2xl shadow-lg p-10 py-12 text-center">
        <h1 className="text-3xl font-extrabold text-[#4ade80] mb-2">
          Verify Your Account
        </h1>
        <p className="text-[#bfbfbf] mb-8">
          Enter the 6-digit code sent to your registered email.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-3 w-full">
            {codes.map((code, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={code}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-semibold text-white rounded-lg border border-[#333b47] bg-[#11161d] focus:border-[#4ade80] outline-none transition"
              />
            ))}
          </div>

          {/* Resend Button */}
          <p className="text-sm text-gray-400">
            Didn’t receive a code?{" "}
            <button
              type="button"
              onClick={() => toast("📧 Resend functionality coming soon!")}
              className="text-[#4ade80] font-medium hover:underline"
            >
              Resend
            </button>
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-lg bg-[#4ade80] text-gray-900 font-semibold hover:bg-[#3bd570] transition disabled:opacity-70"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>

          <span className="text-xs text-gray-400 mt-3">
            ⚠️ Don’t share your verification code with anyone!
          </span>
        </form>
      </div>
    </div>
  );
};

export default TwoStepVerification;
