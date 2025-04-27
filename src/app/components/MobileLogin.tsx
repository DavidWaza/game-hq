"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { postFn } from "@/lib/apiClient";
import Button from "@/components/Button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MobileLogin = () => {
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const { register, handleSubmit } = useForm<{
    // email: string;
    password: string;
    username: string;
  }>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
  };

  const loginMutation = useMutation({
    mutationFn: (userData: {
      // email: string;
      password: string;
      username: string;
    }) => postFn("api/auth/login", userData),
    onSuccess: (data) => {
      toast.success("Login Successful", data);
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    },
    onError: (error) => {
      toast.error(`Login Failed ${error.message}`);
    },
  });

  // Form submission handler
  const onSubmit: SubmitHandler<{
    // email: string;
    password: string;
    username: string;
  }> = (formData) => {
    loginMutation.mutate(formData);
  };

  return (
    <div>
      <div className="relative block md:hidden">
        <div className="bg-gradient-to-br from-[#233d4d] via-[#2c586b] to-[#101820] mx-auto flex justify-center h-full">
          <div className="grid lg:grid-cols-3">
            <div className="col-span-1">
              <h1 className="text-[#fcf8db] text-6xl py-32 px-2">
                Go pick up your dogtags
              </h1>
            </div>
            <div className="col-span-2">
              <div className="relative z-20">
                <div className="pt-0 px-0">
                  <div className="px-10 space-y-5 border rounded-lg rounded-t-none py-3 glass-mobile">
                    <div className="text-center flex flex-col space-y-2 py-4">
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <div className="grid w-full items-center gap-1.5 !text-left">
                          <Label htmlFor="email" className="text-[#fcf8db]">
                            Email
                          </Label>
                          <Input
                            type="email"
                            id="email"
                            {...register("username")}
                            placeholder="Ex. davidwaza@gmail.com"
                          />
                        </div>

                        {/* password */}
                        <div className="grid w-full items-center gap-1.5">
                          <Label
                            htmlFor="password"
                            className="text-[#fcf8db] !text-left"
                          >
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              value={password}
                              type={isVisible ? "text" : "password"}
                              id="password"
                              placeholder="******"
                              {...register("password", {
                                required: "Password is required",
                                minLength: {
                                  value: 8,
                                  message:
                                    "Password must be at least 8 characters",
                                },
                              })}
                              onChange={handleChange}
                            />

                            <button
                              type="button"
                              className="absolute top-1/2 -translate-y-1/2 right-2"
                              onClick={() => setIsVisible(!isVisible)}
                            >
                              {isVisible ? (
                                <Eye size={20} color="#000" />
                              ) : (
                                <EyeClosed size={20} color="#000" />
                              )}
                            </button>
                          </div>
                          <p className="text-[#233d4d] text-sm !text-left">
                            <Link
                              href="/forgot-password"
                              className="hover:text-[#f37f2d] hover:font-bold transition-all ease-linear duration-300"
                            >
                              Forgot password?
                            </Link>
                          </p>
                        </div>

                        <Button variant="primary">
                          {loginMutation.isPending
                            ? "Loading profile"
                            : "Login"}
                        </Button>
                      </form>
                      <div className="divider py-4">
                        <span>Or</span>
                      </div>
                      <Button
                        variant="secondary"
                        size="md"
                        width="full"
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
                        login with Google
                      </Button>
                    </div>
                    <p className="text-[#FD8038] text-center">
                      don&apos;t have an account?{" "}
                      <span className="text-[#fcf8db]">
                        <Link href={"/auth/register"}>Register</Link>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <Image
                src={"/assets/horseman.png"}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
                className="w-2/3 mr-0 ml-auto h-auto object-contain object-center absolute top-60 right-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
