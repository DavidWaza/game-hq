"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Image from "next/image";
import { setSearchParams } from "@/lib/utils";

const Google = ({
  disabled = false,
  text = "Continue With Google",
}: {
  disabled?: boolean;
  text?: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  const googleObj = {
    protocol: "oauth2",
    response_type: "code",
    access_type: "offline",
    client_id: process.env.NEXT_PUBLIC_AUTH_GOOGLE_CLIENT_ID,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI_GOOGLE,
    scope: ["openid", "profile", "email"].join(" "),
    response_mode: "query",
    state: generateRandomState(), // Dynamic state
    code_challenge_method: "", // Set to S256
    code_challenge: "", // Include the generated challenge
    prompt: "consent",
    // service, o2v, ddm, flowName likely not needed explicitly
  };
  const connectToGoogle = () => {
    setIsLoading(true);
    try {
      const route = `${
        process.env.NEXT_PUBLIC_AUTH_GOOGLE_BASE_URI
      }${setSearchParams(googleObj as Record<string, string>, true)}`;
      window.location.href = route;
    } catch (error) {
      console.error("Error connecting to Google:", error);
      setIsLoading(false);
    }
  };
  return (
    <Button
      onClick={connectToGoogle}
      variant="secondary"
      size="md"
      width="full"
      className="w-full"
      disabled={disabled || isLoading}
      loading={isLoading}
      icon={
        <Image
          src={"/assets/icons/google-icons.svg"}
          alt="Google Icon"
          width={0}
          height={0}
          sizes="100vw"
          className="w-5 h-5 object-contain object-center"
        />
      }
    >
      {text}
    </Button>
  );
};
export default Google;
