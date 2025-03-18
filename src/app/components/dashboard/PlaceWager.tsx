"use client";
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
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CalendarForm } from "../../components/dashboard/Calendar";
import Button from "../Button";
import { Check, Plus, Trash } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";

const PlaceWager = () => {
  const router = useRouter();

  return (
    <div>
      <>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="primary" size="sm">
              Place Wager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="!text-black text-center">
                Pick a wager
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="space-y-5 my-10">
              <Tabs defaultValue="private" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="private">Private Wager</TabsTrigger>
                  <TabsTrigger value="public">Public Wager</TabsTrigger>
                </TabsList>

                {/* Private wager */}
                <TabsContent
                  value="private"
                  className="text-[#64748B] text-sm text-center font-semibold mt-4"
                >
                  Create a Private League and invite your friends
                  <div className="my-5 !text-left">
                    <Label>Add an Email or Username</Label>
                    <Input type="text" placeholder="ex. @davidwaza" />
                    <div className="flex justify-between items-start py-3">
                      <div className="flex">
                        <div className="flex items-center gap-2">
                          <p>@davidWaza</p>
                          <button>
                            <Trash size={15} color="#c0392b" weight="duotone" />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="border border-[eeee333] rounded-lg p-1 shadow-sm inline-flex whitespace-nowrap">
                          <Check
                            size={17}
                            color="#239b56"
                            className="font-medium"
                          />
                        </button>
                        <button className="border border-[eeee333] rounded-lg p-1 shadow-sm inline-flex whitespace-nowrap">
                          <Plus size={17} className="font-medium" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Schedule date */}
                  <CalendarForm />
                </TabsContent>
                {/* Public wager */}
                <TabsContent
                  value="public"
                  className="text-[#64748B] text-sm text-center font-semibold mt-4 space-y-5"
                >
                  <p>
                    You can customize you wager when you select a create
                    tournament
                  </p>
                  <Button variant="secondary" size="md">
                    One v One
                    <Plus size={20} />
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => router.push("/dashboard/create-tournament")}
                  >
                    Create Tournament
                    <Plus size={20} />
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter>
              <Button>Play Now</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    </div>
  );
};

export default PlaceWager;
