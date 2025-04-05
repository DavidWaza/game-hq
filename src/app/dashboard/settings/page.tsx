import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Lock, Mail, Globe, Shield, Check, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "GamerHQ Settings",
};

export default function SettingsPage() {
  const accountStrength = 70;
  const accountChecklist = [
    { text: "Select your avatar", completed: true },
    { text: "Complete Account", completed: true },
    { text: "Verify Identity", completed: true },
    { text: "Upload Avatar", completed: false },
    { text: "Made a Deposit", completed: false },
  ];

  return (
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
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-white">
                    strdxc321
                  </h2>
                  <p className="text-sm text-gray-400 mt-1 break-all">
                    fbe99f2-7f4b-11ed-9e24-3ee8038fe302
                  </p>
                </div>
                <div className="w-full gap-2 align_auto">
                  <Button
                    title="Reset Password"
                    variant="outline"
                    className="sheen w-full bg-[#233d4d] hover:bg-[#f37f2d] border-none"
                  >
                    <Lock className="mr-2 h-4 w-4 min-w-4" />{" "}
                    <span className="elipsis">Reset Password</span>
                  </Button>
                  <Button
                    variant="outline"
                    title="Change Gamertag"
                    className="sheen w-full bg-[#233d4d] hover:bg-[#f37f2d] border-none"
                  >
                    <Pencil className="mr-2 h-4 w-4 min-w-4" />{" "}
                    <span className="elipsis">Change Gamertag</span>
                  </Button>
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
              <CardTitle className="text-white">Mission Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between flex-col md:flex-row items-center gap-8">
                <div className="flex flex-col items-center min-w-[190px]">
                  <CircularProgress value={accountStrength} size={190}>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#f37f2d]">
                        {accountStrength}%
                      </div>
                      <div className="text-sm text-gray-400">Complete</div>
                    </div>
                  </CircularProgress>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                  {accountChecklist.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-4 rounded-xl translate-y-0 ${
                        item.completed
                          ? "bg-[#233d4d] text-[#10171B]"
                          : "text-gray-300"
                      }`}
                    >
                      {item.completed ? (
                        <Check className="w-6 h-6 min-w-6" />
                      ) : (
                        <X className="w-6 h-6 min-w-6" />
                      )}
                      <span className="text-lg">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
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
                    <span className="text-gray-300">fixad56534@paxven.com</span>
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
                logging in with Email/Password. A verification code will be sent
                to your email each time you login to secrely protect your
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
  );
}
