"use client";
import {
  Lock,
  ShieldCheck,
  Clock,
  UserCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";

const SecuritySettings = () => {
  // Sample data for login activity; replace with actual data
  const loginActivity = [
    {
      id: 1,
      date: "2025-04-08 14:32",
      location: "Lagos, Nigeria",
      device: "Chrome on Windows",
    },
    {
      id: 2,
      date: "2025-04-07 09:15",
      location: "Abuja, Nigeria",
      device: "Safari on iPhone",
    },
  ];

  // Mock state for 2FA toggle and KYC status
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const kycStatus = "Verified"; // Replace with actual KYC status

  return (
    <div className="bg-[#1a1f2e] rounded-lg p-7 w-full">
      <h1 className="text-3xl font-extrabold text-white mb-8 flex items-center gap-2">
        <ShieldCheck size={36} className="text-orange-500" />
        Security Settings
      </h1>
      <div className="space-y-6">
        {/* Password Management */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <Lock size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Password Management
                </h2>
                <p className="text-gray-300 text-sm">
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>
            <Link
              href="/change-password"
              className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
            >
              <span>Change Password</span>
              <ArrowRight
                size={18}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <ShieldCheck size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Two-Factor Authentication (2FA)
                </h2>
                <p className="text-gray-300 text-sm">
                  {is2FAEnabled
                    ? "2FA is enabled for extra security."
                    : "Enable 2FA to add an extra layer of protection."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIs2FAEnabled(!is2FAEnabled)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                is2FAEnabled
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-gray-600 text-white hover:bg-gray-500"
              }`}
            >
              {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </button>
          </div>
        </div>

        {/* Login Activity */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-full">
              <Clock size={32} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">Login Activity</h2>
              <p className="text-gray-300 text-sm">
                Review recent login attempts and devices.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {loginActivity.length === 0 ? (
              <p className="text-gray-300 text-center py-4">
                No recent login activity.
              </p>
            ) : (
              loginActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-[#2a3147] rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-white font-semibold">
                        {activity.location}
                      </p>
                      <p className="text-gray-300 text-sm">{activity.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-[#fcf8db] text-sm">{activity.device}</p>
                    <Link
                      href="/login-activity-details"
                      className="text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Account Verification */}
        <div className="bg-gradient-to-r from-gray-800 to-[#252b3e] rounded-md p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-full">
                <UserCircle size={32} className="text-orange-500" />
              </div>
              <div>
                <h2 className="text-white text-xl font-semibold">
                  Account Verification
                </h2>
                <p className="text-gray-300 text-sm">
                  {kycStatus === "Verified"
                    ? "Your account is fully verified."
                    : "Complete KYC to verify your identity."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xl font-bold ${
                  kycStatus === "Verified" ? "text-[#fcf8db]" : "text-gray-400"
                }`}
              >
                {kycStatus}
              </span>
              {kycStatus !== "Verified" && (
                <Link
                  href="/verify-account"
                  className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:text-orange-400 transition-all duration-200 group"
                >
                  <span>Verify Now</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;