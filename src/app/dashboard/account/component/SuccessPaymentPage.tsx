"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft } from '@phosphor-icons/react';
import Navbar from "@/components/Navbar"; 

const formatCurrency = (amount: string | number | bigint) => {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(numericAmount);
};

export default function PaymentCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const amount = searchParams.get('amount');
  const status = searchParams.get('status');

  const handleGoBack = () => {
    router.push('/dashboard/account');
  };

  return (
    <>
      <Navbar variant="primary" />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 p-4 text-white flex items-center justify-center !pt-32 md:!pt-16">
        <div className="transIn bg-gray-800 rounded-xl p-8 md:p-12 shadow-2xl max-w-lg w-full text-center flex flex-col items-center">
          
          {status === 'success' ? (
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
                {amount ? (
                  <>
                    You have successfully deposited{" "}
                    <span className="font-bold text-teal-400 text-lg">
                      {formatCurrency(Number(amount))}
                    </span>
                    .
                  </>
                ) : (
                  "Your payment has been confirmed."
                )}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-red-400">
                Payment Failed
              </h1>
              <p className="text-gray-300 text-base mb-8">
                Unfortunately, we could not process your payment. Please try again.
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
      </div>
    </>
  );
}