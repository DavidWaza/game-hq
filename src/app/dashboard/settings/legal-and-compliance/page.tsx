"use client";
import { Scales, Lock, Shield, ClipboardText, ArrowRight, Warning } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";

const LegalAndCompliance = () => {
  // Sample data for compliance documents; replace with actual data
  const complianceDocuments = [
    {
      id: 1,
      title: "Terms of Service",
      lastUpdated: "March 15, 2025",
      description: "General terms and conditions for using our platform."
    },
    {
      id: 2,
      title: "Privacy Policy",
      lastUpdated: "February 28, 2025",
      description: "How we collect, use, and protect your personal information."
    },
  ];

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <Scales size={36} className="text-orange-500" />
        Legal & Compliance
      </h1>
      <div className="space-y-6">
        {/* Important Documents */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <ClipboardText size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Legal Documents
              </h2>
              <p className="text-gray-300 text-sm">
                Essential legal information and policies.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {complianceDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-semibold">{doc.title}</p>
                    <p className="text-gray-300 text-sm">
                      Last Updated: {doc.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-300 text-sm hidden md:block max-w-xs">
                    {doc.description}
                  </p>
                  <Link
                    href={`/legal/${doc.id}`}
                    className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200"
                  >
                    View Document
                  </Link>
                </div>
              </div>
            ))}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white font-semibold">Responsible Gambling Policy</p>
                  <p className="text-gray-300 text-sm">
                    Last Updated: April 1, 2025
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-gray-300 text-sm hidden md:block max-w-xs">
                  Our commitment to promoting safe and responsible gambling.
                </p>
                <Link
                  href="/legal/responsible-gambling"
                  className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200"
                >
                  View Document
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Licensing & Regulation */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Shield size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Licensing & Regulation
                </h2>
                <p className="text-gray-300 text-sm">
                  We operate under strict regulatory oversight.
                </p>
              </div>
            </div>
            <Link
              href="/licensing-details"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>Verification</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
          <div className="mt-4 bg-[#2a3147] p-4 rounded-md">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield size={20} className="text-green-500" />
                <span className="text-white font-medium">Licensed & Regulated by:</span>
              </div>
              <div className="text-gray-300">
                <p>National Gaming Commission</p>
                <p className="text-sm">License Number: NGC/BET/123/2025</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mt-3">
              Our operations are fully compliant with all relevant gaming regulations and laws.
              We are committed to providing a secure, fair, and transparent gaming environment.
            </p>
          </div>
        </div>

        {/* Privacy & Data Protection */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Lock size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Privacy & Data Protection
                </h2>
                <p className="text-gray-300 text-sm">
                  How we safeguard your personal information.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3 text-gray-300 text-sm">
            <p>
              We employ industry-standard security measures to protect your personal data.
              Your privacy is important to us, and we are committed to maintaining the 
              confidentiality of your information.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-[#2a3147] p-3 rounded-md">
                <p className="text-white font-medium mb-2">Data Encryption</p>
                <p className="text-gray-300 text-sm">
                  All sensitive information is encrypted using modern SSL technology.
                </p>
              </div>
              <div className="bg-[#2a3147] p-3 rounded-md">
                <p className="text-white font-medium mb-2">Secure Transactions</p>
                <p className="text-gray-300 text-sm">
                  Financial transactions are processed through secure payment gateways.
                </p>
              </div>
              <div className="bg-[#2a3147] p-3 rounded-md">
                <p className="text-white font-medium mb-2">Data Retention</p>
                <p className="text-gray-300 text-sm">
                  We only keep your data for as long as necessary for legal and business purposes.
                </p>
              </div>
              <div className="bg-[#2a3147] p-3 rounded-md">
                <p className="text-white font-medium mb-2">Your Rights</p>
                <p className="text-gray-300 text-sm">
                  You have the right to access, correct, or delete your personal information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsible Gambling */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Warning size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">
                Responsible Gambling Tools
              </h2>
              <p className="text-gray-300 text-sm">
                Stay in control of your gaming activity.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/responsible/deposit-limits"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Deposit Limits</p>
              <p className="text-gray-300 text-sm">Set daily, weekly, or monthly deposit limits</p>
            </Link>
            
            <Link 
              href="/responsible/time-out"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Time-Out Period</p>
              <p className="text-gray-300 text-sm">Take a short break from betting activities</p>
            </Link>
            
            <Link 
              href="/responsible/self-exclusion"
              className="p-4 bg-[#2a3147] rounded-md hover:bg-[#303a56] transition-all duration-200"
            >
              <p className="text-white font-semibold mb-1">Self-Exclusion</p>
              <p className="text-gray-300 text-sm">Exclude yourself from our platform for a defined period</p>
            </Link>
          </div>
          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-md">
            <p className="text-white text-sm">
              If you or someone you know has a gambling problem, help is available at 
              <Link href="https://www.responsiblegambling.org" className="text-orange-400 ml-1 hover:underline">
                ResponsibleGambling.org
              </Link> or call the helpline at 0810-123-4567.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAndCompliance;