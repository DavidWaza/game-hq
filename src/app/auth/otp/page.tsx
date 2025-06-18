"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const OTP_LENGTH = 6;
const RESEND_COUNTDOWN_SECONDS = 60;

// Mock API call (replace with your actual API)
const verifyOtpApi = async (
  otp: string
): Promise<{ success: boolean; message: string }> => {
  console.log("Verifying OTP:", otp);
  return new Promise((resolve) => {
    setTimeout(() => {
      if (otp === "123456") {
        // Example valid OTP
        resolve({ success: true, message: "OTP verified successfully!" });
      } else {
        resolve({ success: false, message: "Invalid OTP. Please try again." });
      }
    }, 1500);
  });
};

const resendOtpApi = async (
  email: string
): Promise<{ success: boolean; message: string }> => {
  console.log("Resending OTP to:", email);
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API call success/failure
      const didSucceed = Math.random() > 0.1; // 90% success rate
      if (didSucceed) {
        resolve({
          success: true,
          message: "A new OTP has been sent to your email.",
        });
      } else {
        resolve({
          success: false,
          message: "Failed to resend OTP. Please try again in a moment.",
        });
      }
    }, 1500);
  });
};

const OtpPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [countdown, setCountdown] = useState(RESEND_COUNTDOWN_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const userEmailForResend = "user@example.com";

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      setCanResend(true);
      setCountdown(0);
      return;
    }
    if (countdown > 0 && !canResend) {
      const timerId = setTimeout(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, canResend]);

  const handleChange = (
    elementIndex: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (isNaN(Number(value))) return; 

    const newOtp = [...otp];
    newOtp[elementIndex] = value.slice(-1); 
    setOtp(newOtp);
    setError(null); 
    if (
      value &&
      elementIndex < OTP_LENGTH - 1 &&
      inputRefs.current[elementIndex + 1]
    ) {
      inputRefs.current[elementIndex + 1]?.focus();
    }
  };

  const handleKeyDown = (
    elementIndex: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[elementIndex] &&
      elementIndex > 0 &&
      inputRefs.current[elementIndex - 1]
    ) {
      inputRefs.current[elementIndex - 1]?.focus();
    }
  };

  const handleSubmitOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const response = await verifyOtpApi(enteredOtp);
    setIsLoading(false);

    if (response.success) {
      setSuccessMessage(response.message + " Redirecting...");
      setTimeout(() => {
        router.push("/auth/reset-password"); 
      }, 1500);
    } else {
      setError(response.message);
      setOtp(new Array(OTP_LENGTH).fill("")); 
      if (inputRefs.current[0]) {
        inputRefs.current[0]?.focus(); 
      }
    }
  };

  const handleResendOtp = useCallback(async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    const response = await resendOtpApi(userEmailForResend); 
    setIsResending(false);

    if (response.success) {
      setSuccessMessage(response.message);
      setCanResend(false);
      setCountdown(RESEND_COUNTDOWN_SECONDS);
    } else {
      setError(response.message);
      setCanResend(true); 
    }
  }, [canResend, isResending, userEmailForResend]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-rose-100 p-4 selection:bg-pink-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-10 transform transition-all duration-500 ease-in-out hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4 ring-4 ring-purple-200">
            <ShieldCheck size={36} className="text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Enter Verification Code
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            A {OTP_LENGTH}-digit code has been sent to your registered email
            address. Please enter it below.
          </p>
        </div>

        <form onSubmit={handleSubmitOtp} className="space-y-6">
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl sm:text-3xl font-semibold border rounded-lg transition-all duration-200 ease-in-out
                            focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                            ${
                              error
                                ? "border-red-400 ring-red-200 focus:ring-red-500 focus:border-red-500"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                required
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm animate-shake"
              role="alert"
            >
              <AlertCircle size={20} className="mr-2 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage &&
            !error && ( 
              <div
                className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg flex items-center text-sm animate-fadeIn"
                role="status"
              >
                <CheckCircle2 size={20} className="mr-2 text-green-600" />
                <span>{successMessage}</span>
              </div>
            )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg 
                       transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none 
                       focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75
                       disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-200 pt-5">
          {!canResend ? (
            <p className="text-sm text-slate-500">
              Didn&apos;t receive the code? Resend in{" "}
              <span className="font-semibold text-purple-600">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={isResending || !canResend}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline disabled:text-slate-400 disabled:cursor-not-allowed disabled:no-underline flex items-center justify-center mx-auto group"
            >
              {isResending ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw
                    size={14}
                    className="mr-1 transition-transform duration-300 group-hover:rotate-90"
                  />
                  Resend OTP
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default OtpPage;

