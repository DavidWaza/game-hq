import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ViewBets = () => {
  return (
    <div className="rounded-lg bg-white border border-[#CBD5E1] mt-5 h-96 flex justify-center pt-10 max-w-[400px]  ml-auto w-[400px] ">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="complete">Complete</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-[#64748B] text-center">
          You currently have no open Wagers
          <p className="mt-10 font-bold text-[#1A5EFF]">View Wager History</p>
        </TabsContent>
        <TabsContent value="pending" className="text-[#64748B] text-center">
          You currently have no open Wagers
          <p className="mt-10 font-bold text-[#1A5EFF]">View Wager History</p>
        </TabsContent>
        <TabsContent value="complete" className="text-[#64748B] text-center">
          You currently have no open Wagers
          <p className="mt-10 font-bold text-[#1A5EFF]">View Wager History</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewBets;
