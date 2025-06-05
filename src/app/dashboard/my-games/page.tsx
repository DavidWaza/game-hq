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
  CaretLeft,
  CaretRight,
  CaretDoubleLeft,
  CaretDoubleRight,
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
  <div className="transIn flex flex-col items-center justify-center py-12 text-center min-h-[200px]">
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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  // if (totalPages <= 1) return null;

  const pageNumbers: (number | string)[] = [];
  // maxPagesToShow: Number of actual page number buttons (e.g., 3 means c-1, c, c+1 or similar)
  const maxPageNumButtons = 3; // Show up to 3 page numbers like [c-1, c, c+1]
  // More complex logic could allow more if space, this is a simpler constraint.

  // Always show first page
  if (totalPages > 0) {
    // Ensure totalPages is positive
    // First page button
    // pageNumbers.push(1); // Will be handled by loop or specific condition

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumButtons / 2)
    );
    let endPage = Math.min(
      totalPages,
      currentPage + Math.ceil(maxPageNumButtons / 2) - 1
    );

    // Adjust window if it's too small due to being at the start/end
    if (endPage - startPage + 1 < maxPageNumButtons) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageNumButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageNumButtons + 1);
      }
    }
    // Ensure startPage is at least 1
    startPage = Math.max(1, startPage);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 0) pageNumbers.push(i); // Ensure positive page numbers
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
  }

  // Remove duplicates that might occur if totalPages is small, e.g. [1, ..., 1] or [1, 2, ..., 2]
  const uniquePageNumbers = pageNumbers.filter((value, index, self) => {
    if (value === "...") {
      // Allow ellipsis if it's not consecutive or not at the very start/end next to a direct number it replaces
      if (
        index > 0 &&
        self[index - 1] !== "..." &&
        typeof self[index - 1] === "number" &&
        typeof self[index + 1] === "number" &&
        (self[index + 1] as number) > (self[index - 1] as number) + 1
      ) {
        return true;
      } else if (
        index === 0 &&
        typeof self[index + 1] === "number" &&
        (self[index + 1] as number) > 1
      ) {
        // Ellipsis at start
        return true;
      } else if (
        index === self.length - 1 &&
        typeof self[index - 1] === "number" &&
        (self[index - 1] as number) < totalPages
      ) {
        // Ellipsis at end
        return true;
      }
      // Simplified: just remove consecutive ellipses
      return !(index > 0 && self[index - 1] === "...");
    }
    return self.indexOf(value) === index;
  });

  // Ensure first and last pages are present if totalPages > 1 and not already in uniquePageNumbers by the loop
  if (totalPages > 1) {
    if (!uniquePageNumbers.includes(1)) {
      if (uniquePageNumbers.length > 0 && uniquePageNumbers[0] === "...") {
        uniquePageNumbers.unshift(1);
      } else if (
        uniquePageNumbers.length > 0 &&
        typeof uniquePageNumbers[0] === "number" &&
        uniquePageNumbers[0] > 1
      ) {
        if (uniquePageNumbers[0] > 2) uniquePageNumbers.splice(0, 0, 1, "...");
        else uniquePageNumbers.unshift(1);
      } else if (uniquePageNumbers.length === 0 && totalPages > 0) {
        // Handle case where loop produced nothing
        uniquePageNumbers.push(1);
      }
    }
    if (!uniquePageNumbers.includes(totalPages)) {
      if (
        uniquePageNumbers.length > 0 &&
        uniquePageNumbers[uniquePageNumbers.length - 1] === "..."
      ) {
        uniquePageNumbers.push(totalPages);
      } else if (
        uniquePageNumbers.length > 0 &&
        typeof uniquePageNumbers[uniquePageNumbers.length - 1] === "number" &&
        typeof uniquePageNumbers[uniquePageNumbers.length - 1] === "number" &&
        (uniquePageNumbers[uniquePageNumbers.length - 1] as number) < totalPages
      ) {
        if (
          typeof uniquePageNumbers[uniquePageNumbers.length - 1] === "number" &&
          (uniquePageNumbers[uniquePageNumbers.length - 1] as number) <
            totalPages - 1
        )
          uniquePageNumbers.push("...", totalPages);
        else uniquePageNumbers.push(totalPages);
      } else if (uniquePageNumbers.length === 0 && totalPages > 1) {
        // Handle case where loop produced nothing but totalPages > 1
        uniquePageNumbers.push(totalPages);
      }
    }
  }

  // Final cleanup of page numbers to ensure they are sensible (e.g. no [1, ..., 2])
  const finalPages: (number | string)[] = [];
  for (let i = 0; i < uniquePageNumbers.length; i++) {
    const current = uniquePageNumbers[i];
    const prev = finalPages[finalPages.length - 1];
    if (current === "...") {
      if (prev !== "...") finalPages.push(current); // Avoid consecutive "..."
    } else if (
      typeof current === "number" &&
      typeof prev === "number" &&
      current === prev + 1 &&
      uniquePageNumbers[i - 2] === "..."
    ) {
      const next = uniquePageNumbers[i + 1];
      if (
        typeof prev === "string" &&
        prev === "..." &&
        typeof next === "number" &&
        next === current + 1
      ) {
        finalPages.push(current);
      } else {
        finalPages.push(current);
      }
    } else {
      finalPages.push(current);
    }
  }
  // Filter out cases like [1, "...", 2] -> [1, 2]
  const trulyFinalPages = finalPages.filter((p, i, arr) => {
    if (p === "...") {
      const prevN = arr[i - 1];
      const nextN = arr[i + 1];
      if (
        typeof prevN === "number" &&
        typeof nextN === "number" &&
        nextN === prevN + 1
      ) {
        return false; // Remove "..." if it's between two consecutive numbers
      }
    }
    return true;
  });

  return (
    <div className="max-h-max pt-6 flex items-center justify-center flex-wrap gap-1 sm:gap-2">
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80"
        aria-label="First page"
      >
        <CaretDoubleLeft size={16} weight="bold" />
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80"
        aria-label="Previous page"
      >
        <CaretLeft size={16} weight="bold" />
      </button>

      {trulyFinalPages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={`page-${page}-${index}`}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
              currentPage === page
                ? "bg-gradient-to-r from-[#ff4500] to-[#ffa500] text-white shadow-md"
                : "text-gray-300 bg-gray-700/60 hover:bg-gray-600/80"
            }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={`ellipsis-${index}`}
            className="px-1 sm:px-2 py-1.5 text-xs sm:text-sm text-gray-400"
          >
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80"
        aria-label="Next page"
      >
        <CaretRight size={16} weight="bold" />
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="flex items-center justify-center p-2 text-sm font-medium text-gray-300 bg-gray-700/60 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/80"
        aria-label="Last page"
      >
        <CaretDoubleRight size={16} weight="bold" />
      </button>
    </div>
  );
};

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
          if (response) updateData("createdWagers", response);
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
          if (response) updateData("createdTournaments", response);
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
          if (response) updateData("invitedWagers", response);
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
          if (response) updateData("invitedTournaments", response);
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
    const fetchData = async () => {
      if (!username || !methods) return;

      switch (activeTab) {
        case "created":
          await Promise.all([
            methods.getCreatedWagers(),
            methods.getCreatedTournaments(),
          ]);
          break;
        case "invitations":
          await Promise.all([
            methods.getInvitedWagers(),
            methods.getInvitedTournaments(),
          ]);
          break;
        default:
          break;
      }
    };

    fetchData();
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

  const handlePageChange = (newPage: number) => {
    // Determine current data list to get totalPages for boundary check
    let currentDataKey: keyof GameState;
    switch (activeTab) {
      case "created":
        currentDataKey =
          activeSubTab === "solo" ? "createdWagers" : "createdTournaments";
        break;
      case "invitations":
        currentDataKey =
          activeSubTab === "solo" ? "invitedWagers" : "invitedTournaments";
        break;
      case "ongoing":
        currentDataKey =
          activeSubTab === "solo" ? "ongoingWagers" : "ongoingTournaments";
        break;
      default:
        return; // Should not happen
    }
    const listTotalPages = data[currentDataKey]?.totalPages ?? 1;
    let pagenum = newPage;

    if (newPage >= 1 && newPage <= listTotalPages) {
      pagenum = newPage;
    } else if (newPage < 1 && listTotalPages > 0) {
      // Prevent going below 1
      pagenum = 1;
    } else if (newPage > listTotalPages && listTotalPages > 0) {
      // Prevent going above totalPages
      pagenum = listTotalPages;
    }
    // if listTotalPages is 0 (e.g. no data), allow setting to 1.
    else if (listTotalPages === 0 && newPage === 1) {
      pagenum = 1;
    }

    switch (currentDataKey) {
      case "createdWagers":
        if (activeSubTab === "solo") {
          methods.getCreatedWagers(pagenum);
        } else {
          methods.getCreatedTournaments(pagenum);
        }
        break;
      case "createdTournaments":
        methods.getCreatedTournaments(pagenum);
        break;

      default:
        break;
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (activeSubTab === "solo" && !(methods as any).getOngoingWagers)
          isLoading = false;
        if (
          activeSubTab === "tournament" &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          !(methods as any).getOngoingTournaments
        )
          isLoading = false;
        break;
      default:
        dataList = {
          records: [],
          totalRecords: 0,
          recordCount: 0,
          totalPages: 0,
        };
        isLoading = false;
        baseEmptyMessage = "Error loading";
        actionText = "N/A";
        ActionIcon = InfoIcon;
    }

    const dynamicEmptyMessage = `${baseEmptyMessage} ${activeSubTab} games ${
      activeTab === "created"
        ? ""
        : activeTab === "invitations"
        ? "invitations"
        : "currently ongoing"
    }.`;

    const newCurrentPage = dataList.totalPages;

    return (
      <motion.div
        key={`${activeTab}-${activeSubTab}`}
        variants={tabContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="overflow-x-auto bg-black/20 p-3 sm:p-4 rounded-b-lg rounded-tr-lg shadow-2xl backdrop-blur-md border border-gray-700/30 min-h-[350px] justify_auto"
      >
        <div className="max-h-max mb-4 flex items-center flex-wrap gap-2 sm:flex sm:space-x-2 p-1 bg-gray-800/20 rounded-lg max-w-max w-full">
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
          <div className="transIn">
            <table className="min-w-full">
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonRow key={i} columns={5} />
                ))}
              </tbody>
            </table>
          </div>
        ) : dataList.records.length > 0 ? (
          <>
            <div className="">
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
                      const status =
                        "match_date" in item ? "Scheduled" : "Pending"; // This status logic might need refinement

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-gray-800/70 transition-colors duration-200 hover:bg-gray-700/40"
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
            </div>
            {/* {dataList.totalPages > 0 && ( */}
            <Pagination
              currentPage={newCurrentPage}
              totalPages={dataList.totalPages}
              onPageChange={handlePageChange}
            />
            {/* )} */}
          </>
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
                {" "}
                {username}&apos;s{" "}
              </span>{" "}
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
              {" "}
              <AnimatePresence mode="wait">
                {renderContent()}
              </AnimatePresence>{" "}
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
                {" "}
                Latest Tournaments & Events{" "}
              </p>
              <p className="text-gray-400 text-sm px-4">
                {" "}
                Discover new challenges and climb the leaderboards!{" "}
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
