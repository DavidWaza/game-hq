"use client";
import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { postFn } from "@/lib/apiClient";
import Link from "next/link";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }
    return null;
  };

  const handleSubmitNewPassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    const response = await postFn("api/auth/resetpassword", {
      password: newPassword,
      confirm_password: newPassword,
      token,
      email,
    });

    if (response) {
      const message = "Password reset successfully. Redirecting to login...";
      toast.success(message);
      setSuccessMessage(message);
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } else {
      const message = "Failed to reset password. Please try again.";
      toast.error(message);
      setError(message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !email) router.push("/auth/forgot-password");
  }, [token, email, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-teal-100 p-4 selection:bg-cyan-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-10 transform transition-all duration-500 ease-in-out hover:shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-sky-100 rounded-full mb-4 ring-4 ring-sky-200">
            <LockKeyhole size={36} className="text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800">
            Set New Password
          </h1>
          <p className="text-slate-600 mt-2 text-sm">
            Choose a strong, new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmitNewPassword} className="space-y-5">
          {/* New Password Field */}
          <div className="relative">
            <input
              disabled={isLoading}
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(null);
              }}
              placeholder="Enter new password"
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ease-in-out
                          focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                          ${
                            error &&
                            (error.includes("Password") ||
                              error.includes("match"))
                              ? "border-red-400 ring-red-200 focus:ring-red-500 focus:border-red-500"
                              : "border-slate-300 hover:border-slate-400"
                          }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-sky-600"
              aria-label={
                showNewPassword ? "Hide new password" : "Show new password"
              }
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm New Password Field */}
          <div className="relative">
            <input
              disabled={isLoading}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null);
              }}
              placeholder="Confirm new password"
              className={`w-full px-4 py-3 border rounded-lg transition-all duration-300 ease-in-out
                          focus:ring-2 focus:ring-sky-500 focus:border-sky-500
                          ${
                            error && error.includes("match")
                              ? "border-red-400 ring-red-200 focus:ring-red-500 focus:border-red-500"
                              : "border-slate-300 hover:border-slate-400"
                          }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-sky-600"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && (
            <div
              className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center text-sm animate-shake"
              role="alert"
            >
              <AlertCircle
                size={20}
                className="mr-2 mt-0.5 text-red-600 flex-shrink-0"
              />
              <span>{error}</span>
            </div>
          )}

          {successMessage && !error && (
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
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-lg 
                       transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none 
                       focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75
                       disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Setting Password...
              </>
            ) : (
              "Set New Password"
            )}
          </button>
        </form>
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
export default ResetPasswordPage;
