"use client";
import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Mail, Globe, Shield } from "lucide-react";
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

export default function SettingsPage() {
  const [avatarSrc, setAvatarSrc] = React.useState("/assets/default-av.jpg");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const username = useAuth()?.user?.username;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarSrc(reader.result);
      };

      // Handle potential errors during file reading
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        // Optionally: Show an error message to the user
      };

      // Read the file content as a Data URL
      reader.readAsDataURL(file);
    } else if (file) {
      // Handle the case where the selected file is not an image
      console.warn("Selected file is not an image:", file.type);
      // Optionally: Show an error message to the user
    }

    // Reset the input value to allow selecting the same file again
    if (event.target) {
      event.target.value = null;
    }
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
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/assets/default-av.jpg" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="outline"
                      className="sheen absolute bottom-0 right-0 rounded-full bg-[#233d4d] hover:bg-[#f37f2d] border-none"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <input
                      type="file"
                      ref={fileInputRef} // Assign the ref
                      onChange={handleFileChange} // Call handler on file selection
                      accept="image/*" // Accept only image files
                      style={{ display: "none" }} // Hide the element visually
                      aria-hidden="true" // Hide from accessibility tree
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">
                      {username}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1 break-all">
                      fbe99f2-7f4b-11ed-9e24-3ee8038fe302
                    </p>
                  </div>

                  <div className="text-sm text-gray-400">
                    <p>Joined December 19th, 2022</p>
                    <p>Last Login on March 19th, 2024</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Settings Area */}
          <div className="col-span-1 md:col-span-2 space-y-6">
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
