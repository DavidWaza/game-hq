"use client";
import { Question, Headset, ChatCircleText, Folder, ArrowRight, Globe } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const SupportAndHelp = () => {
  // Sample data for FAQ items; replace with actual data
  const faqItems = [
    {
      id: 1,
      question: "How do I make a deposit?",
      answer: "Navigate to the Wallet section, select 'Deposit', choose your preferred payment method, and follow the instructions.",
    },
    {
      id: 2,
      question: "What is the minimum withdrawal amount?",
      answer: "The minimum withdrawal amount is ₦1,000. Processing times vary depending on your chosen payment method.",
    },
  ];

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <Headset size={36} className="text-orange-500" />
        Support & Help Center
      </h1>
      <div className="space-y-6">
        {/* Contact Support */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <ChatCircleText size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Contact Support
              </h2>
              <p className="text-gray-300 text-sm">
                Our team is available 24/7 to assist you with any issues.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white font-semibold">Live Chat</p>
                  <p className="text-gray-300 text-sm">
                    Available 24/7 - Typical response time: 2 minutes
                  </p>
                </div>
              </div>
              <Link
                href="/live-chat"
                className="inline-block px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-all duration-200"
              >
                Start Chat
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white font-semibold">Email Support</p>
                  <p className="text-gray-300 text-sm">
                    Response time: Within 24 hours
                  </p>
                </div>
              </div>
              <Link
                href="mailto:support@example.com"
                className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200"
              >
                support@example.com
              </Link>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Question size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-300 text-sm">
                  Quick answers to common questions.
                </p>
              </div>
            </div>
            <Link
              href="/faq"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>View All FAQs</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
          
          <div className="space-y-4">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-[#2a3147] rounded-md"
              >
                <div className="mb-2">
                  <p className="text-white font-semibold">{item.question}</p>
                </div>
                <p className="text-gray-300 text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Folder size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Help Categories
              </h2>
              <p className="text-gray-300 text-sm">
                Browse help topics by category.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/help/account"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Account Management</p>
              <p className="text-gray-300 text-sm">Login issues, profile settings, verification</p>
            </Link>
            
            <Link 
              href="/help/payments"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Payments & Withdrawals</p>
              <p className="text-gray-300 text-sm">Deposit methods, withdrawal process, payment issues</p>
            </Link>
            
            <Link 
              href="/help/betting"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Betting Guidelines</p>
              <p className="text-gray-300 text-sm">How to place bets, odds explanation, betting rules</p>
            </Link>
            
            <Link 
              href="/help/bonuses"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Bonuses & Promotions</p>
              <p className="text-gray-300 text-sm">Terms, wagering requirements, claiming bonuses</p>
            </Link>
          </div>
        </div>

        {/* Self-Service Tools */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Globe size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Self-Service Tools
                </h2>
                <p className="text-gray-300 text-sm">
                  Quickly resolve common issues yourself.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/reset-password"
              className="flex items-center gap-2 p-3 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <span className="text-white">Reset Password</span>
            </Link>
            <Link
              href="/account-verification"
              className="flex items-center gap-2 p-3 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <span className="text-white">Verify Account</span>
            </Link>
            <Link
              href="/transaction-history"
              className="flex items-center gap-2 p-3 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <span className="text-white">View Transaction History</span>
            </Link>
            <Link
              href="/responsible-gambling"
              className="flex items-center gap-2 p-3 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <span className="text-white">Responsible Gambling Tools</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAndHelp;