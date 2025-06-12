"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ArrowLeft } from "@phosphor-icons/react";
import Navbar from "@/components/Navbar";
import { postFn } from "@/lib/apiClient";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function PaymentCallback() {
  const { setState, refetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState<"success" | "failed" | undefined>(
    undefined
  );

  const handleGoBack = useCallback(() => {
    router.push("/dashboard/account");
  }, [router]);

  useEffect(() => {
    const verifyTransaction = async () => {
      if (!reference) return;

      try {
        setState(
          { loader: true, message: "Verifying transaction..." },
          "fullScreenLoader"
        );

        const response = await postFn("/api/topup/verify", {
          reference,
        });

        if (response) {
          await refetchUser();
          toast.success(response.message || "Payment successful");
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch {
        setStatus("failed");
        setState(
          { loader: false, message: "Transaction verification failed" },
          "fullScreenLoader"
        );
      } finally {
        setState({ loader: false, message: "" }, "fullScreenLoader");
      }
    };

    if (reference) {
      verifyTransaction();
    } else {
      handleGoBack();
    }
  }, [reference, setState, handleGoBack]);

  return (
    <>
      <Navbar variant="primary" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 text-white flex items-center justify-center !pt-32 md:!pt-16">
        {status && (
          <div className="transIn bg-gray-800 rounded-xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center flex flex-col items-center">
            {status === "success" ? (
              <>
                <CheckCircle
                  size={64}
                  className="text-green-400 mb-5"
                  weight="fill"
                />

                <h1 className="text-2xl md:text-3xl font-bold mb-3">
                  Payment Successful
                </h1>

                <p className="text-gray-300 text-base mb-8">
                  Your payment has been confirmed.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-bold mb-3 text-red-400">
                  Payment Failed
                </h1>
                <p className="text-gray-300 text-base mb-8">
                  Unfortunately, we could not process your payment. Please try
                  again.
                </p>
              </>
            )}

            <button
              onClick={handleGoBack}
              className="flex items-center justify-center w-full max-w-xs py-3 px-4 bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors text-white font-semibold text-base"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Wallet
            </button>
          </div>
        )}
      </div>
    </>
  );
}
