/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getFn } from "@/lib/apiClient";

import {
  ListPlus,
  EnvelopeSimple,
  ClockClockwise,
  Play,
  Info as InfoIcon,
  UserPlus,
  Eye,
  User as UserIcon, // For Solo
  UsersThree as TournamentIcon, // For Tournament
} from "@phosphor-icons/react";
import { TypePrivateWager } from "../../../../types/global"; // Ensure this has matchMode: number
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Define mock structures if not available in global types
interface InvitationRecord {
  id: string;
  gameTitle: string;
  totalAmount: string | number;
  statusText: string;
  invitedBy?: string;
  gameMode: "solo" | "tournament"; // Added for sub-filtering
}

interface OngoingGameRecord {
  id: string;
  gameTitle: string;
  totalAmount: string | number;
  statusText: string;
  nextAction?: string;
  gameMode: "solo" | "tournament"; // Added for sub-filtering
}

const CreateWagerBanner = () => {
  const { user } = useAuth();
  const username = user?.username || "Challenger";
  const router = useRouter();

  const [createdGamesData, setCreatedGamesData] = useState<TypePrivateWager[]>(
    []
  );
  const [invitationsData, setInvitationsData] = useState<InvitationRecord[]>(
    []
  );
  const [ongoingGamesData, setOngoingGamesData] = useState<OngoingGameRecord[]>(
    []
  );

  const [loadingStates, setLoadingStates] = useState({
    created: false,
    invitations: false,
    ongoing: false,
  });

  const [activeTab, setActiveTab] = useState<
    "created" | "invitations" | "ongoing"
  >("created");

  // New state for sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"solo" | "tournament">(
    "solo"
  );

  // Reset sub-tab when main tab changes
  useEffect(() => {
    setActiveSubTab("solo");
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  useEffect(() => {
    const fetchData = async (tabName: typeof activeTab) => {
      setLoadingStates((prev) => ({ ...prev, [tabName]: true }));
      try {
        if (tabName === "created") {
          const response = await getFn(`/api/privatewagers`);
          // Assuming response.records is TypePrivateWager[] and includes matchMode
          setCreatedGamesData(response?.records || []);
        } else if (tabName === "invitations") {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setInvitationsData([
            {
              id: "INV001",
              gameTitle: "Chess Titans",
              totalAmount: "10 SOL",
              statusText: `Invited by ${username}`,
              gameMode: "solo", // Added gameMode
            },
            {
              id: "INV002",
              gameTitle: "Poker Arena",
              totalAmount: "5 SOL",
              statusText: "Ready Players: User789 invited",
              gameMode: "tournament", // Added gameMode
            },
            {
              id: "INV003",
              gameTitle: "1v1 Brawl",
              totalAmount: "3 SOL",
              statusText: `Invited by Admin`,
              gameMode: "solo",
            },
          ]);
        } else if (tabName === "ongoing") {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setOngoingGamesData([
            {
              id: "ONG001",
              gameTitle: "Ludo Clash",
              totalAmount: "2 SOL",
              statusText: "Your Move!",
              nextAction: "PLAY",
              gameMode: "solo", // Added gameMode
            },
            {
              id: "ONG002",
              gameTitle: "FIFA Pro Tournament",
              totalAmount: "5 SOL",
              statusText: "Waiting for Opponent",
              gameMode: "tournament", // Added gameMode
            },
          ]);
        }
      } catch (error) {
        console.error(`Failed to fetch ${tabName} games:`, error);
        if (tabName === "created") setCreatedGamesData([]);
        if (tabName === "invitations") setInvitationsData([]);
        if (tabName === "ongoing") setOngoingGamesData([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, [tabName]: false }));
      }
    };
    fetchData(activeTab);
  }, [activeTab, username]);

  const TableRow = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <motion.tr
      className={`border-b border-gray-800/70 transition-colors duration-200 ${
        onClick ? "hover:bg-gray-700/40 cursor-pointer" : "hover:bg-gray-700/20"
      }`}
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
    >
      {children}
    </motion.tr>
  );

  const TableCell = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <td
      className={`px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );

  const HeaderCell = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <th
      className={`px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );

  const StatusIndicator = ({ statusText }: { statusText: string }) => {
    let color = "text-gray-400";
    if (statusText.toLowerCase().includes("invited")) color = "text-blue-400";
    if (
      statusText.toLowerCase().includes("starting soon") ||
      statusText.toLowerCase().includes("ready")
    )
      color = "text-yellow-400";
    if (
      statusText.toLowerCase().includes("your turn") ||
      statusText.toLowerCase().includes("your move")
    )
      color = "text-green-400";
    if (statusText.toLowerCase().includes("opponent"))
      color = "text-purple-400";
    return <span className={`${color} font-medium`}>{statusText}</span>;
  };

  const ActionButton = ({
    children,
    onClick,
    icon: Icon,
    variant = "primary",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    icon?: React.ElementType;
    variant?: "primary" | "secondary";
  }) => (
    <motion.button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 ${
        variant === "primary"
          ? "bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white shadow-md hover:shadow-lg"
          : "bg-gray-600/50 text-gray-300 hover:bg-gray-500/70 hover:text-white"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {Icon && <Icon size={14} weight="bold" />}
      {children}
    </motion.button>
  );

  const SkeletonRow = ({ columns = 5 }: { columns?: number }) => (
    <tr className="border-b border-gray-800/70">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-700/50 rounded animate-pulse"></div>
        </td>
      ))}
    </tr>
  );

  const EmptyState = ({
    message,
    icon: Icon,
  }: {
    message: string;
    icon?: React.ElementType;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center min-h-[200px]">
      {" "}
      {/* Added min-h */}
      {Icon && (
        <Icon size={48} className="text-gray-600/80 mb-4" weight="light" />
      )}
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );

  // SubTabButton Component
  const SubTabButton = ({
    label,
    icon: Icon,
    isActive,
    onClick,
  }: {
    label: string;
    subTabName: "solo" | "tournament";
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm rounded-md font-medium transition-all duration-200 ease-in-out focus:outline-none
                  ${
                    isActive
                      ? "bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white shadow-md hover:shadow-lg"
                      : "bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 hover:text-white"
                  }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Icon size={16} weight={isActive ? "bold" : "regular"} />
      {label}
    </button>
  );

  const renderContent = () => {
    let dataList: any[] = []; // Initialize with an empty array
    let isLoading, baseEmptyMessage, actionText, ActionIcon;
    const commonColumns = [
      "Game ID",
      "Game Name",
      "Total Amount",
      "Status",
      "Action",
    ];

    switch (activeTab) {
      case "created":
        dataList = createdGamesData;
        isLoading = loadingStates.created;
        baseEmptyMessage = "You haven't created any";
        actionText = "START";
        ActionIcon = Play;
        break;
      case "invitations":
        dataList = invitationsData;
        isLoading = loadingStates.invitations;
        baseEmptyMessage = "No pending";
        actionText = "JOIN";
        ActionIcon = UserPlus;
        break;
      case "ongoing":
        dataList = ongoingGamesData;
        isLoading = loadingStates.ongoing;
        baseEmptyMessage = "No";
        actionText = "VIEW";
        ActionIcon = Eye;
        break;
      default:
        return null;
    }

    // Filter data based on activeSubTab
    const filteredDataList = dataList.filter((item) => {
      if (activeTab === "created") {
        // Uses matchMode
        const gameMode = item.matchMode === 1 ? "tournament" : "solo";
        return gameMode === activeSubTab;
      }
      // For invitations and ongoing, assumes item.gameMode directly
      return item.gameMode === activeSubTab;
    });

    const dynamicEmptyMessage = `${baseEmptyMessage} ${activeSubTab} games ${
      activeTab === "created"
        ? ""
        : activeTab === "invitations"
        ? "invitations"
        : "currently ongoing"
    }.`;

    return (
      <motion.div
        key={`${activeTab}-${activeSubTab}`} // Ensure re-render on subTab change if needed, or manage content internally
        variants={tabContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="overflow-x-auto bg-black/20 p-3 sm:p-4 rounded-b-lg rounded-tr-lg shadow-2xl backdrop-blur-md border border-gray-700/30 min-h-[350px]"
      >
        {/* Sub-Tab Buttons Area */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:flex sm:space-x-2 p-1 bg-gray-800/20 rounded-lg sm:max-w-md">
          <SubTabButton
            label="Solo Games"
            subTabName="solo"
            icon={UserIcon}
            isActive={activeSubTab === "solo"}
            onClick={() => setActiveSubTab("solo")}
          />
          <SubTabButton
            label="Tournaments"
            subTabName="tournament"
            icon={TournamentIcon}
            isActive={activeSubTab === "tournament"}
            onClick={() => setActiveSubTab("tournament")}
          />
        </div>

        {isLoading ? (
          <table className="min-w-full">
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} columns={commonColumns.length} />
              ))}
            </tbody>
          </table>
        ) : filteredDataList.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <TableRow>
                {commonColumns.map((col) => (
                  <HeaderCell key={col}>{col}</HeaderCell>
                ))}
              </TableRow>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filteredDataList.map((item: any) => (
                <TableRow
                  key={item.id}
                  onClick={
                    activeTab === "ongoing"
                      ? () => console.log("View game details:", item.id)
                      : undefined
                  }
                >
                  <TableCell>{item.id?.substring(0, 8) || "N/A"}...</TableCell>
                  <TableCell>
                    {item.name || item.gameTitle || item.title || "N/A"}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(
                      Number(item.amount || item.totalAmount || 0)
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusIndicator
                      statusText={item.status || item.statusText || "Pending"}
                    />
                  </TableCell>
                  <TableCell>
                    <ActionButton
                      onClick={() => {
                        router.push(
                          `/dashboard/play-games/dice-roll?wagerId=${item.id}`
                        );
                        console.log(`${actionText} game:`, item.id);
                      }}
                      icon={ActionIcon}
                    >
                      {actionText}
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState message={dynamicEmptyMessage} icon={InfoIcon} />
        )}
      </motion.div>
    );
  };

  const tabs = [
    { name: "created", label: "My Created Games", icon: ListPlus },
    { name: "invitations", label: "Invitations", icon: EnvelopeSimple },
    { name: "ongoing", label: "Ongoing Games", icon: ClockClockwise },
  ];

  const TabButton = ({
    label,
    tabName,
    icon: Icon,
    isActive,
  }: {
    label: string;
    tabName: string;
    icon: React.ElementType;
    isActive: boolean;
  }) => (
    <button
      onClick={() => setActiveTab(tabName as any)}
      className={`relative flex items-center justify-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium rounded-t-md transition-colors duration-300 ease-in-out focus:outline-none z-10 ${
        isActive ? "text-white" : "text-gray-400 hover:text-white"
      }`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Icon
        size={16}
        weight={isActive ? "fill" : "regular"}
        className={`${isActive ? "text-[#ffa500]" : ""}`}
      />
      {label}
      {isActive && (
        <motion.div
          className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff4500] to-[#ffa500] rounded-t-sm"
          layoutId="activeTabIndicator"
          initial={false}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );

  return (
    <div className="relative min-h-screen bg-[#0f0f0f] overflow-hidden">
      <Navbar variant="primary" />
      <section className="relative z-10 container mx-auto px-4 sm:px-6 pt-24 pb-32 md:pt-32 md:pb-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start"
        >
          <div className="space-y-6 sm:space-y-8">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white uppercase tracking-tighter leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff4500] to-[#ffa500]">
                {username}&apos;s
              </span>
              <br />
              <span className="text-[#e0e0e0]">Game Hub</span>
            </motion.h1>
            <motion.div
              variants={itemVariants}
              className="flex border-b border-gray-700/50"
            >
              {tabs.map((tab) => (
                <TabButton
                  key={tab.name}
                  label={tab.label}
                  tabName={tab.name}
                  icon={tab.icon}
                  isActive={activeTab === tab.name}
                />
              ))}
            </motion.div>
            <div className="mt-1 sm:mt-2">
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>
          </div>
          <motion.div
            variants={itemVariants}
            className="relative hidden lg:flex items-center justify-center bg-gray-800/30 rounded-xl shadow-2xl border-2 border-[#ff4500]/30 min-h-[400px] md:min-h-[500px] p-6 backdrop-blur-md"
          >
            <div className="text-center">
              <Image
                src="/assets/h1_img-4.png"
                alt="Game Visuals"
                width={380}
                height={380}
                className="w-full max-w-xs sm:max-w-sm h-auto object-contain drop-shadow-[0_0_30px_rgba(255,100,0,0.4)] opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
              <p className="mt-6 text-xl font-semibold text-[#ffa500]">
                Latest Tournaments & Events
              </p>
              <p className="text-gray-400 text-sm px-4">
                Discover new challenges and climb the leaderboards!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,#ff4500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,#ffa500_2%,transparent_40%)] opacity-15"
          animate={{ opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default CreateWagerBanner;
