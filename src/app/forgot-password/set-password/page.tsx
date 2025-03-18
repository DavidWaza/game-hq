"use client";
import React, { useState } from "react";
import Button from "@/app/components/Button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeClosed } from "@phosphor-icons/react";

const Login = () => {
  //   const router = useRouter();
  // const [registrationType, setRegistrationType] = useState<"email" | "phone">(
  //   "email"
  // );
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [confirmPasswordIsVisible, setConfirmPasswordIsVisible] =
    useState(false);

  const { register, handleSubmit } = useForm<{
    password: string;
    confirmPassword: string;
  }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onSubmit: SubmitHandler<{
    password?: string;
    confirmPassword?: string;
  }> = () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      //   if (email) {
      //     window.location.href = "/forgot-password/set-password/password-set-confirm";
      //   }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rounded-t-0 rounded-lg bg-white p-5 md:p-20 md:w-1/2 m-auto">
      <div className="bg-[#222254] py-4 rounded-t-lg">
        <h1 className="text-white text-center text-lg">Set new password</h1>
      </div>
      <div className="px-10 space-y-10 pb-5 border rounded-lg rounded-t-0">
        <div className="text-center flex flex-col space-y-2 py-4">
          <span className="text-sm text-[#64748B] mt-5">
            Enter the new password to be associated to your account
          </span>

          {/* password form */}
          <form onSubmit={handleSubmit(onSubmit)} className="py-7 space-y-4">
            {/* password */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              <div className="relative">
                <Input
                  value={password}
                  type={isVisible ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  onChange={handleChange}
                  placeholder="New password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-2"
                  onClick={() => setIsVisible(!isVisible)}
                >
                  {isVisible ? (
                    <Eye size={20} weight="duotone" color="#000" />
                  ) : (
                    <EyeClosed size={20} weight="duotone" color="#000" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              <div className="relative">
                <Input
                  value={password}
                  type={confirmPasswordIsVisible ? "text" : "password"}
                  id="password"
                  {...register("password")}
                  onChange={handleChange}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-2"
                  onClick={() =>
                    setConfirmPasswordIsVisible(!confirmPasswordIsVisible)
                  }
                >
                  {confirmPasswordIsVisible ? (
                    <Eye size={20} weight="duotone" color="#000" />
                  ) : (
                    <EyeClosed size={20} weight="duotone" color="#000" />
                  )}
                </button>
              </div>
            </div>
            <Button variant="primary" size="md" width="full">
              {isLoading ? "Loading..." : "Set Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
