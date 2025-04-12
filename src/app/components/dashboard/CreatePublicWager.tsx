import React from "react";
import Button from "@/components/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CreatePublicWager = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-[#1A5EFF] border border-[#1A5EFF] hover:bg-[#1A5EFF] px-6 py-3 text-base rounded-lg text-white transition-all duration-500 ease-in-out">
          Create New Public Wager
        </DialogTrigger>
        <DialogContent className="pt-0 px-0">
          <DialogHeader>
            <DialogTitle className="text-center bg-[#222254] py-3 !text-white text-lg">
              Create Public Wager
            </DialogTitle>
          </DialogHeader>
          <div className="px-10 space-y-5">
            <DialogDescription className="text-center py-4"></DialogDescription>
            <Button
              variant="primary"
              size="sm"
              //   onClick={() => setOpenCreateAccount(true)}
            >
              Create Wager
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePublicWager;
