"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Globe, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Metadata } from "next";
import AccountForms from "../Components/AccountForms";
import { useAuth } from "@/contexts/AuthContext";
import EditableAvatar from "./Components/EditableAvatar";
import { toast } from "sonner";
import { Clipboard } from "@phosphor-icons/react";
import moment from 'moment'

export default function SettingsPage() {
  const username = useAuth()?.user?.username;

  const userId = "fbe99f2-7f4b-11ed-9e24-3ee8038fe302";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(userId)
      .then(() => {
        toast.success("Bet ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Section */}
          <div className="relative col-span-1 flex flex-col gap-5">
            <Card className="bg-[#1a1f2e] border-none transInLonger sticky top-[140px]">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <EditableAvatar />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">
                      {username}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-400 mt-1 break-all">
                        {userId}
                      </p>
                      <Clipboard
                        size={20}
                        onClick={copyToClipboard}
                        className="text-white cursor-pointer hover:scale-90 transition-all ease-in-out duration-300 hover:text-gray-600"
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-400">
                    <p>Joined 10th Sept, 2025</p>
                    <p>Last Login on {moment(Date.now()).format("MMMM Do, YYYY")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Area */}
          <div className="col-span-1 md:col-span-2 space-y-6 ">
            {/* Mission Objectives */}
            <Card className="bg-[#1a1f2e] border-none transRightLonger">
              <CardHeader>
                <CardTitle className="text-white">Personal Details</CardTitle>
              </CardHeader>
              <CardContent>
                <AccountForms username={username || "Guest"} />
              </CardContent>
            </Card>
            {/* Email Management */}
            <Card className="bg-[#1a1f2e] border-none transRightLonger">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="mr-2" /> Account Emails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#233d4d] rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-300">
                        fixad56534@paxven.com
                      </span>
                      <Badge className="bg-green-600">Verified</Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-transparent border-[#f37f2d] text-[#f37f2d] hover:bg-[#f37f2d] hover:text-white"
                    >
                      Primary
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-[#233d4d] hover:bg-[#f37f2d] border-none"
                  >
                    <Mail className="mr-2 h-4 w-4" /> Add Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2FA */}
            <Card className="bg-[#1a1f2e] border-none transRightLonger">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="mr-2" /> Multi-factor Authentication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  Add an Extra Layer of security to your SportOdds account when
                  logging in with Email/Password. A verification code will be
                  sent to your email each time you login to secrely protect your
                  account.
                </p>
                <Button className="bg-[#f37f2d] hover:bg-[#233d4d]">
                  Enroll
                </Button>
              </CardContent>
            </Card>

            {/* Language */}
            <Card className="bg-[#1a1f2e] border-none transRightLonger">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="mr-2" /> Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select defaultValue="en">
                  <SelectTrigger className="w-full bg-[#233d4d] border-none">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
