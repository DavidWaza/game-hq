"use client";
import Button from "@/app/components/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  LogOut,
  Trophy,
  Users,
  Wallet,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { CaretDown } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import styles from "./UserPopover.module.scss";

interface UserPopoverProps {
  gamerName: string;
  email: string;
  avatarUrl?: string;
}

const UserPopover = ({ gamerName, email, avatarUrl }: UserPopoverProps) => {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    { url: "/dashboard/join-tournament", text: "Tournaments", icon: Trophy },
    { url: "/dashboard/one-on-one", text: "One-on-One", icon: Gamepad2 },
    { url: "/dashboard/teams", text: "Teams", icon: Users },
    { url: "/dashboard/wallet", text: "Wallet", icon: Wallet },
    { url: "/dashboard/settings", text: "Settings", icon: Settings },
  ];

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <Button
            asChild
            variant="primary"
            className={`${styles.userPopover__trigger} ${
              isOpen ? "active" : ""
            }`}
          >
            <div className={styles.userPopover__balance}>₦20,000</div>

            <Avatar className={styles.userPopover__avatar}>
              <AvatarImage src="/assets/default-av.jpg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <CaretDown
              size={20}
              className={`${styles.userPopover__caret} ${
                isOpen ? styles.open : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={styles.userPopover__content} align="end">
          {/* User Info Section */}
          <div className={styles.userPopover__userInfo}>
            <Avatar className={styles.userPopover__userAvatar}>
              <AvatarImage src={avatarUrl} alt={gamerName} />
              <AvatarFallback>{gamerName[0]}</AvatarFallback>
            </Avatar>
            <div className={styles.userPopover__userDetails}>
              <span className={styles.userPopover__userName}>{gamerName}</span>
              <span className={styles.userPopover__userEmail}>{email}</span>
            </div>
          </div>

          {/* Useful Links */}
          <div className={styles.userPopover__links}>
            {links.map((link, index) => {
              const Icon = link.icon;
              return (
                <Link
                  key={index}
                  href={link.url}
                  className={styles.userPopover__link}
                >
                  <Icon className="h-4 w-4" />
                  {link.text}
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className={styles.userPopover__logout}>
            {/* <Button onClick={logout} variant="primary" size="sm" width="full">
              <LogOut className="h-4 w-4" />
              <span className="text-sm"> Logout</span>
            </Button> */}
            <button
              className={`${styles.userPopover__link} ${styles.userPopover__danger}`}
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default UserPopover;
