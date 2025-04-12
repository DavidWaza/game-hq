import React, { useState, useRef } from 'react';

// Adjust these imports based on your project setup and UI library
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react"; // Or your specific icon import

function EditableAvatar() {
  const [avatarSrc, setAvatarSrc] = useState('/assets/default-av.jpg');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.warn("No file selected or files is null.");
      return;
    }

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            setAvatarSrc(reader.result);
            // NOTE: Server upload logic would typically go here.
        } else {
             console.error("FileReader result is not a string.");
        }
      };
       reader.onerror = (error) => {
           console.error("Error reading file:", error);
       }
      reader.readAsDataURL(file);
    } else if (file) {
        console.warn("Selected file is not an image:", file.type);
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className="w-24 h-24">
        <AvatarImage key={avatarSrc} src={avatarSrc} alt="User Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <Button
        size="icon"
        variant="outline"
        className="sheen absolute bottom-0 right-0 rounded-full bg-[#233d4d] hover:bg-[#f37f2d] border-none cursor-pointer"
        onClick={handleEditClick}
        aria-label="Change avatar"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}

export default EditableAvatar;