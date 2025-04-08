import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import Button from "@/app/components/Button";
import { CaretDoubleLeft } from "@phosphor-icons/react";

interface ProfileEditFormData {
  username: string;
  firstName: string;
  lastName: string;
  about: string;
}

interface ProfileEditProps {
  reveal: boolean;
  setReveal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileEdit = ({ reveal, setReveal }: ProfileEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { isLoading, errors },
  } = useForm<ProfileEditFormData>({
    mode: "onChange",
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      about: "",
    },
  });

  const onSubmit: SubmitHandler<ProfileEditFormData> = (formData) => {
    console.log(formData);
  };

  return (
    <div className="flex justify-center my-10">
      <div className="bg-[#0E1012] rounded-lg p-10 max-w-[600px] w-full hover:shadow-[#f37f2d]/20 border border-[#f37f2d]/20">
        <h1 className="capitalize text-2xl text-balance">
          general Information
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-1.5 !text-left my-10">
            <Label htmlFor="username" className="text-[#fcf8db]">
              Username
            </Label>
            <Input
              id="username"
              autoComplete="off"
              className="text-white"
              {...register("username", {
                required: "Username is required",
              })}
              placeholder="Ex. davidwaza"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="flex justify-center items-center gap-5">
            {/* First Name */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              <Label htmlFor="firstName" className="text-[#fcf8db]">
                First Name
              </Label>
              <Input
                id="firstName"
                className="text-white"
                autoComplete="off"
                {...register("firstName", {
                  required: "First Name is required",
                })}
                placeholder="Ex. david"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="grid w-full items-center gap-1.5 !text-left">
              <Label htmlFor="lastName" className="text-[#fcf8db]">
                Last Name
              </Label>
              <Input
                id="lastName"
                autoComplete="off"
                className="text-white"
                {...register("lastName", {
                  required: "Last Name is required",
                })}
                placeholder="Ex. waza"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="my-10">
            <Label htmlFor="about" className="text-[#fcf8db]">
              About Me
            </Label>
            <Textarea placeholder="A pro at fifa, bring on your best team" />
          </div>
          <div>
            <Button variant="primary">
              {isLoading ? "Loading..." : "Save Changes"}
            </Button>
          </div>
          <div className="flex justify-center items-center mt-7">
            <button
              type="button"
              onClick={() => setReveal(!reveal)}
              className="text-white flex gap-2 hover:animate-bounce"
            >
              <CaretDoubleLeft size={25} />
              Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEdit;
