"use client";
import React from "react";
import { Envelope, X } from "@phosphor-icons/react";
import Button from "@/components/Button";
import Link from "next/link";

interface EmailVerificationModalProps {
  isOpen: boolean;
  showLogin?: boolean;
  showClose?: boolean;
  onClose: () => void;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  showLogin = true,
  showClose = true,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-md w-full text-center transform transition-all duration-300 scale-100 animate-fade-in">
        <div className="flex justify-end">
          {showClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              <X size={28} />
            </button>
          )}
        </div>
        <div className="transIn flex justify-center items-center mb-5 border-b-2 border-[#FB5D12] rounded-full w-20 h-20 mx-auto bg-[#233D4D]">
          <Envelope size={40} className="text-[#FB5D12] " />
        </div>
        <h2 className="transIn text-3xl font-extrabold mb-4 text-gray-800">
          Verify Your Email
        </h2>
        <p className="transIn mb-7 text-gray-600 text-lg">
          A verification link has been sent to your email address. Please check
          your inbox and follow the link to activate your account.
        </p>
        <div className="transIn flex flex-col space-y-4">
          {showLogin && (
            <Link prefetch href="/auth/login">
              <Button variant="primary" size="lg" width="full">
                Proceed to Login
              </Button>
            </Link>
          )}
          {showClose && (
            <Button
              variant="secondary"
              size="lg"
              width="full"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
