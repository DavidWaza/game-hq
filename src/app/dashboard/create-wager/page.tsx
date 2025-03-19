'use client'
import DashboardNavbar from "@/app/components/dashboard/DashboardNavbar";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const CreateWager = () => {
    const router = useRouter()
  return (
    <div>
      <DashboardNavbar bgColor={"bg-[#f2f3f4]"} />
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Image Section */}
        <div className="w-full h-auto mt-24 md:mt-0">
          <Image
            src={"/assets/ludo-friends.jpg"}
            alt="ludo"
            width={0}
            height={0}
            sizes="100vw"
            className="w-full h-auto lg:h-screen object-cover object-center"
          />
        </div>

        {/* Buttons Section */}
        <div className="bg-[#fffdf6] h-[58vh] lg:h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 w-full">
            <button className="bg-black border py-3 text-white w-full max-w-xs rounded-xl shadow-lg hover:shadow-sm transition-all ease-in-out duration-300">
              Create One-v-One
            </button>
            <button className="bg-[#d4ac0d] border py-3 text-white w-full max-w-xs rounded-xl shadow-lg hover:shadow-sm transition-all ease-in-out duration-300" onClick={() => router.push('/dashboard/create-tournament')} >
              Create Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWager;
