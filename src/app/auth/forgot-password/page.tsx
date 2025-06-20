"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Mail,
  KeyRound,
  Send,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { postFn } from "@/lib/apiClient";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
  }>();

  const onSubmit: SubmitHandler<{ email: string }> = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setIsSubmitted(false);
    try {
      const response = await postFn("/api/auth/forgotpassword", data);
      console.log(response);
      if (response) {
        toast.success("Password reset link sent to your email");
        // router.push("/auth/login");
        setIsSubmitted(true);
      } else {
        setApiError("We can't find a user with that email address.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 selection:bg-purple-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-10 transform transition-all duration-500 ease-in-out hover:shadow-2xl">
        {!isSubmitted ? (
          <>
            {/* Header Section */}
            <div className="transIn text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4 ring-4 ring-indigo-200">
                <KeyRound size={36} className="text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">
                Password Lost in Cyberspace?
              </h1>
              <p className="text-slate-600 mt-2 text-sm">
                No worries! We&apos;ll send a rescue mission (a password reset
                link just for you!) to your registered email address.
              </p>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="transIn space-y-6"
            >
              <div className="relative group">
                <Mail
                  size={20}
                  className={`absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-300 ${
                    errors.email ? "text-red-500" : ""
                  }`}
                />
                <Input
                  disabled={isLoading}
                  type="text"
                  id="email"
                  {...register("email", {
                    required: "We need your email or phone to find you!",
                    pattern: {
                      value:
                        /^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{7,15})$/,
                      message:
                        "Oops! Please enter a valid email or phone number.",
                    },
                  })}
                  placeholder="Enter your Email or Phone Number"
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-300 ease-in-out
                              focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                              ${
                                errors.email
                                  ? "border-red-400 ring-red-200 focus:ring-red-500 focus:border-red-500"
                                  : "border-slate-300 group-hover:border-slate-400"
                              }`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
              </div>

              {errors.email && (
                <p className="text-red-600 text-xs flex items-center mt-1">
                  <AlertTriangle size={14} className="mr-1" />
                  {errors.email.message}
                </p>
              )}

              {apiError && (
                <div
                  className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg relative flex items-center text-sm animate-shake"
                  role="alert"
                >
                  <AlertTriangle size={20} className="mr-2 text-red-600" />
                  <span>{apiError}</span>
                </div>
              )}

              <Button
                variant="primary"
                size="lg"
                width="full"
                type="submit"
                className={`w-full  text-white font-semibold py-3 rounded-lg 
                            transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none 
                            focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75
                            disabled:bg-slate-300 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    Searching Account...
                  </>
                ) : (
                  <>
                    <Send
                      size={18}
                      className="mr-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                    Send Password Reset Code
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          // Post-Submission / Success Message
          <div className="transIn text-center space-y-5 py-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full ring-4 ring-green-200">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">
              Password Reset Link En Route!
            </h2>
            <p className="text-slate-600 text-sm">
              We&apos;ve dispatched a password reset link just for you! Please
              check your inbox (and your spam/junk folder, just in case!). This
              link will be active for a limited time.
            </p>
            <p className="text-slate-500 text-xs">
              Didn&apos;t receive it after a few minutes?{" "}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setApiError(null);
                }}
                className="text-indigo-600 font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded"
              >
                Try sending again
              </button>
            </p>
          </div>
        )}
        <div className="mt-8 text-center border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Suddenly remembered it?{" "}
            <Link
              href={"/auth/login"}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors duration-200"
            >
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
