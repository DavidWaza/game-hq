"use client";
import React, { useState, useEffect, useCallback } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import {
  HourglassMedium,
  ArrowClockwise,
  WarningOctagon,
} from "@phosphor-icons/react";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const COUNTDOWN_SECONDS = 60;

const EmailVerificationPage = () => {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resentMessage, setResentMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const userEmail = user?.email || "";

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      return;
    }
    const timerId = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [countdown]);

  const handleResendEmail = useCallback(async () => {
    if (!canResend) return;

    setIsResending(true);
    setResentMessage(null);
    setErrorMessage(null);

    console.log("Requesting to resend verification email to:", userEmail);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock API Response
    const success = Math.random() > 0.1;
    if (success) {
      setResentMessage(
        "A new verification email has been sent. Check your inbox!"
      );
      setCountdown(COUNTDOWN_SECONDS);
      setCanResend(false);
    } else {
      setErrorMessage(
        "Oops! Something went wrong. Please try again in a moment."
      );
      setCountdown(10);
      setCanResend(false);
    }

    setIsResending(false);
  }, [canResend, userEmail]);

  // Format countdown time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100 p-4 selection:bg-cyan-200">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl p-6 md:p-10 text-center transform transition-all duration-500 ease-in-out hover:shadow-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-sky-100 rounded-full mb-6 ring-4 ring-sky-200">
          <MailCheck size={48} className="text-sky-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-800 mb-3">
          Verify Your Email Address
        </h1>
        <p className="text-slate-600 mb-2 text-sm">
          We&apos;ve sent a verification link to{" "}
          <strong className="text-slate-700">{userEmail}</strong>.
        </p>
        <p className="text-slate-600 mb-8 text-sm">
          Please click the link in that email to complete your registration and
          activate your account.
        </p>

        {resentMessage && (
          <div className="mb-6 p-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-sm flex items-center justify-center animate-fadeIn">
            {/* <CheckCircle2 size={18} className="mr-2" /> */}
            {resentMessage}
          </div>
        )}

        {errorMessage && (
          <div
            className="mb-6 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm  animate-shake"
            role="alert"
          >
            <WarningOctagon size={25} weight='duotone' className="mr-2 w-full mx-auto" />
            {errorMessage}
          </div>
        )}

        <div className="bg-slate-50 p-6 rounded-lg shadow-inner">
          <div className=" text-slate-700 mb-4">
            <HourglassMedium size={25} weight='duotone' className="mr-2 text-[#2D495A] w-full mx-auto" />
            <p className="text-sm">
              Didn&apos;t receive the email? You can request another in:
            </p>
          </div>
          {!canResend && (
            <p className="text-4xl font-semibold text-sky-600 mb-5 tracking-wider">
              {formatTime(countdown)}
            </p>
          )}

          <Button
            variant="primary"
            size="lg"
            width="full"
            onClick={handleResendEmail}
            disabled={!canResend || isResending}
            className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center group
                        ${
                          canResend && !isResending
                            ? "bg-sky-500 hover:bg-sky-600 text-white transform hover:scale-105 focus:ring-sky-400"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }
                        focus:outline-none focus:ring-2 focus:ring-opacity-75`}
          >
            {isResending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                <ArrowClockwise
                  size={18}
                  className={`mr-2 transition-transform duration-300 ${
                    canResend ? "group-hover:rotate-90" : ""
                  }`}
                />
                Resend Verification Email
              </>
            )}
          </Button>
        </div>

        <div className="mt-8 text-center border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Already verified or need to log in?{" "}
            <Link
              href={"/auth/login"} // Adjust if your login path is different
              className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors duration-200"
            >
              Go to Login
            </Link>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            If you&apos;re still having trouble, please contact our support
            team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
