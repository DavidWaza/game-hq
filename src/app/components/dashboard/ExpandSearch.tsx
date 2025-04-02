"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";

interface ExpandableSearchProps {
  onSearch?: (searchValue: string) => void;
  placeholder?: string;
}

const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  onSearch,
  placeholder = "Search invitation by code",
}) => {
  const [expanded, setExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setExpanded(!expanded);
    if (!expanded) {
      // Focus the input when expanding
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch?.(searchValue);
    }
  };

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        expanded &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
      }
    },
    [expanded]
  );

  useEffect(() => {
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside, expanded]);

  return (
    <div
      ref={searchContainerRef}
      className={`flex items-center transition-all duration-300 rounded-full border border-[#d0d3d4] shadow-sm ${
        expanded ? "w-full bg-white" : "w-10 h-10 bg-white"
      }`}
    >
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <button
          type={expanded ? "submit" : "button"}
          onClick={expanded ? undefined : toggleSearch}
          className={`flex items-center justify-center ${
            expanded ? "ml-3" : "w-10 h-10"
          }`}
        >
          <Search size={18} className="text-gray-500" />
        </button>

        {expanded && (
          <>
            <input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-2 py-2 outline-none font-normal text-sm"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="flex items-center justify-center w-10 h-10"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default ExpandableSearch;
