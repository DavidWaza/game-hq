import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";

import Button from "@/components/Button";
import { XCircle } from "@phosphor-icons/react";
import ExpandableSearch from "./ExpandSearch";
import WagerCard from "./WagerCard";

const JoinWager = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            Join Wager
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="!text-black text-center">
              Join a Wager
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className=" w-full">
            <Tabs defaultValue="private" className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="private">Invitation Wager</TabsTrigger>
                <TabsTrigger value="public">Open Wager</TabsTrigger>
              </TabsList>

              {/* Private wager */}
              <TabsContent
                value="private"
                className="text-[#64748B] text-sm text-center font-semibold my-7"
              >
                <ExpandableSearch />
                <div className="flex justify-center my-3">
                  <XCircle size={32} weight="duotone" color="#a93226" />
                </div>
                You have not been invited for any wager
              </TabsContent>

              {/* Public wager */}
              <TabsContent
                value="public"
                className="text-[#64748B] text-sm font-semibold mt-4 space-y-4"
              >
                <WagerCard
                  gameMode={"Tournament"}
                  gameCategory={"Sports"}
                  gameTitle={"FC 25"}
                  gameDateSchedule={"23rd March, 2025"}
                  gameUsers={10}
                />
                <WagerCard
                  gameMode={"One-v-One"}
                  gameCategory={"Action"}
                  gameTitle={"Call of Duty"}
                  gameDateSchedule={"30th March, 2025"}
                  gameUsers={2}
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button>Join a Wager</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JoinWager;
