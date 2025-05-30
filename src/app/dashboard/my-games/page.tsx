// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getFn } from "@/lib/apiClient";
import { toast } from "sonner";
import {
  ListPlus,
  EnvelopeSimple,
  ClockClockwise,
  Play,
  Info as InfoIcon,
  UserPlus,
  Eye,
  User as UserIcon,
  UsersThree as TournamentIcon,
} from "@phosphor-icons/react";
import {
  TypePrivateWager,
  TypeSingleTournament,
} from "../../../../types/global";
import { formatCurrency } from "@/lib/utils";

// Types
type TabType = "created" | "invitations" | "ongoing";
type SubTabType = "solo" | "tournament";

interface GameData {
  records: TypePrivateWager[] | TypeSingleTournament[];
  totalRecords: number;
  recordCount: number;
  totalPages: number;
}

interface GameState {
  createdWagers: GameData;
  createdTournaments: GameData;
  invitedWagers: GameData;
  invitedTournaments: GameData;
  ongoingWagers: GameData;
  ongoingTournaments: GameData;
}

interface LoadingState {
  createdWagers: boolean;
  createdTournaments: boolean;
  invitedWagers: boolean;
  invitedTournaments: boolean;
  ongoingWagers: boolean;
  ongoingTournaments: boolean;
}

// Animation variants
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

// Constants
const TABS = [
  { name: "created", label: "My Created Games", icon: ListPlus },
  { name: "invitations", label: "Invitations", icon: EnvelopeSimple },
  { name: "ongoing", label: "Ongoing Games", icon: ClockClockwise },
] as const;

// Components
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
    {Icon && (
      <Icon size={48} className="text-gray-600/80 mb-4" weight="light" />
    )}
    <p className="text-gray-400 text-lg">{message}</p>
  </div>
);

const StatusIndicator = ({ statusText }: { statusText: string }) => {
  const getColor = (text: string) => {
    if (text.toLowerCase().includes("invited")) return "text-blue-400";
    if (
      text.toLowerCase().includes("starting soon") ||
      text.toLowerCase().includes("ready")
    )
      return "text-yellow-400";
    if (
      text.toLowerCase().includes("your turn") ||
      text.toLowerCase().includes("your move")
    )
      return "text-green-400";
    if (text.toLowerCase().includes("opponent")) return "text-purple-400";
    return "text-gray-400";
  };

  return (
    <span className={`${getColor(statusText)} font-medium`}>{statusText}</span>
  );
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

const SubTabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
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

const TabButton = ({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
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

const CreateWagerBanner = () => {
  const { user, store } = useAuth();
  const username = user?.username;
  const [activeTab, setActiveTab] = useState<TabType>("created");
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("solo");
  const [data, setData] = useState<GameState>({
    createdWagers: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
    createdTournaments: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
    invitedWagers: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
    invitedTournaments: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
    ongoingWagers: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
    ongoingTournaments: {
      records: [],
      totalRecords: 0,
      recordCount: 0,
      totalPages: 1,
    },
  });
  const [loadingStates, setLoadingStates] = useState<LoadingState>({
    createdWagers: false,
    createdTournaments: false,
    invitedWagers: false,
    invitedTournaments: false,
    ongoingWagers: false,
    ongoingTournaments: false,
  });

  const updateData = useCallback((key: keyof GameState, value: GameData) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateLoadingState = useCallback(
    (key: keyof LoadingState, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const methods = useMemo(
    () => ({
      getCreatedWagers: async (page = 1) => {
        try {
          updateLoadingState("createdWagers", true);
          const response = await getFn(`/api/users/wagers?page=${page}`);
          updateData("createdWagers", response);
        } catch {
          toast.error("Error fetching created wagers");
        } finally {
          updateLoadingState("createdWagers", false);
        }
      },
      getCreatedTournaments: async (page = 1) => {
        try {
          updateLoadingState("createdTournaments", true);
          const response = await getFn(
            `/api/users/tournamentwager?page=${page}`
          );
          updateData("createdTournaments", response);
        } catch {
          toast.error("Error fetching created tournaments");
        } finally {
          updateLoadingState("createdTournaments", false);
        }
      },
      getInvitedWagers: async (page = 1) => {
        try {
          updateLoadingState("invitedWagers", true);
          const response = await getFn(
            `/api/users/invitee_tournament_wager?page=${page}`
          );
          updateData("invitedWagers", response);
        } catch {
          toast.error("Error fetching invited wagers");
        } finally {
          updateLoadingState("invitedWagers", false);
        }
      },
      getInvitedTournaments: async (page = 1) => {
        try {
          updateLoadingState("invitedTournaments", true);
          const response = await getFn(
            `/api/users/invited_but_not_played_tournament_wager?page=${page}`
          );
          updateData("invitedTournaments", response);
        } catch {
          toast.error("Error fetching invited tournaments");
        } finally {
          updateLoadingState("invitedTournaments", false);
        }
      },
    }),
    [updateData, updateLoadingState]
  );

  useEffect(() => {
    setActiveSubTab("solo");
  }, [activeTab]);

  useEffect(() => {
    const fetchData = async (tabName: TabType) => {
      switch (tabName) {
        case "created":
          await Promise.all([
            methods.getCreatedWagers(1),
            methods.getCreatedTournaments(1),
          ]);
          break;
        case "invitations":
          await Promise.all([
            methods.getInvitedWagers(1),
            methods.getInvitedTournaments(1),
          ]);
          break;
        case "ongoing":
          // Add ongoing game fetching methods here
          break;
      }
    };

    if (username && activeTab && methods) fetchData(activeTab);
  }, [activeTab, username, methods]);

  const handleAction = (item: TypePrivateWager | TypeSingleTournament) => {
    const games = store.games;
    if (games && games.length > 0) {
      const game = games.find((game) => game.id === item.game_id);
      if (game && game.gameurl) {
        window.location.href = game.gameurl;
      }
    }
  };

  const renderContent = () => {
    let dataList: GameData;
    let isLoading: boolean;
    let baseEmptyMessage: string;
    let actionText: string;
    let ActionIcon: React.ElementType;

    switch (activeTab) {
      case "created":
        dataList =
          activeSubTab === "solo"
            ? data.createdWagers
            : data.createdTournaments;
        isLoading =
          activeSubTab === "solo"
            ? loadingStates.createdWagers
            : loadingStates.createdTournaments;
        baseEmptyMessage = "You haven't created any";
        actionText = "START";
        ActionIcon = Play;
        break;
      case "invitations":
        dataList =
          activeSubTab === "solo"
            ? data.invitedWagers
            : data.invitedTournaments;
        isLoading =
          activeSubTab === "solo"
            ? loadingStates.invitedWagers
            : loadingStates.invitedTournaments;
        baseEmptyMessage = "No pending";
        actionText = "JOIN";
        ActionIcon = UserPlus;
        break;
      case "ongoing":
        dataList =
          activeSubTab === "solo"
            ? data.ongoingWagers
            : data.ongoingTournaments;
        isLoading =
          activeSubTab === "solo"
            ? loadingStates.ongoingWagers
            : loadingStates.ongoingTournaments;
        baseEmptyMessage = "No";
        actionText = "VIEW";
        ActionIcon = Eye;
        break;
    }

    const dynamicEmptyMessage = `${baseEmptyMessage} ${activeSubTab} games ${
      activeTab === "created"
        ? ""
        : activeTab === "invitations"
        ? "invitations"
        : "currently ongoing"
    }.`;

    return (
      <motion.div
        key={`${activeTab}-${activeSubTab}`}
        variants={tabContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="overflow-x-auto bg-black/20 p-3 sm:p-4 rounded-b-lg rounded-tr-lg shadow-2xl backdrop-blur-md border border-gray-700/30 min-h-[350px]"
      >
        <div className="mb-4 flex items-center flex-wrap gap-2 sm:flex sm:space-x-2 p-1 bg-gray-800/20 rounded-lg max-w-max w-full">
          <SubTabButton
            label="Solo Games"
            icon={UserIcon}
            isActive={activeSubTab === "solo"}
            onClick={() => setActiveSubTab("solo")}
          />
          <SubTabButton
            label="Tournaments"
            icon={TournamentIcon}
            isActive={activeSubTab === "tournament"}
            onClick={() => setActiveSubTab("tournament")}
          />
        </div>

        {isLoading ? (
          <table className="min-w-full">
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonRow key={i} columns={5} />
              ))}
            </tbody>
          </table>
        ) : dataList.records.length > 0 ? (
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-800/70">
                <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider">
                  Game ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider">
                  Game Name
                </th>
                <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold text-[#ffa500]/80 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {dataList.records.map(
                (item: TypePrivateWager | TypeSingleTournament) => {
                  const title = "title" in item ? item.title : "N/A";
                  const amount = "amount" in item ? item.amount : "0";
                  const status = "match_date" in item ? "Scheduled" : "Pending";

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-gray-800/70 transition-colors duration-200 hover:bg-gray-700/40 cursor-pointer"
                    >
                      <td className="px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                        {item.id?.substring(0, 8) || "N/A"}...
                      </td>
                      <td className="px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                        {title}
                      </td>
                      <td className="px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                        {formatCurrency(Number(amount))}
                      </td>
                      <td className="px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                        <StatusIndicator statusText={status} />
                      </td>
                      <td className="px-4 py-3.5 text-xs sm:text-sm text-gray-300 whitespace-nowrap">
                        <ActionButton
                          onClick={() => handleAction(item)}
                          icon={ActionIcon}
                        >
                          {actionText}
                        </ActionButton>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        ) : (
          <EmptyState message={dynamicEmptyMessage} icon={InfoIcon} />
        )}
      </motion.div>
    );
  };

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
              {TABS.map((tab) => (
                <TabButton
                  key={tab.name}
                  label={tab.label}
                  icon={tab.icon}
                  isActive={activeTab === tab.name}
                  onClick={() => setActiveTab(tab.name)}
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
