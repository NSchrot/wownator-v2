"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchCharacters } from "@/lib/actions/game-actions";
import type { CharacterSearchResult } from "@/lib/types/game";

type Props = {
  onGuess: (characterId: number) => void;
  disabled: boolean;
  isSubmitting: boolean;
};

export function CharacterSearch({ onGuess, disabled, isSubmitting }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CharacterSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchCharacters(q);
      setResults(data);
      setIsOpen(data.length > 0);
      setHighlightIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (character: CharacterSearchResult) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    onGuess(character.id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Cleanup debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="relative max-w-md mx-auto">
      {/* Input */}
      <div className="relative">
        <input
          ref={inputRef}
          id="character-search-input"
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          disabled={disabled}
          placeholder={
            disabled
              ? "✦ Desafio concluído!"
              : "Digite o nome do personagem..."
          }
          autoComplete="off"
          className={`
            w-full px-5 py-3.5 rounded-xl
            font-(family-name:--font-crimson) text-sm
            bg-[hsl(223,24%,11%)] text-amber-100/80
            border border-gold/15
            placeholder:text-amber-100/25
            focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-200
          `}
        />

        {/* Loading spinner */}
        {(isSearching || isSubmitting) && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}

        {/* Search icon */}
        {!isSearching && !isSubmitting && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-100/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 py-1 rounded-xl border border-gold/15 bg-[hsl(223,24%,11%)] shadow-2xl shadow-black/40 overflow-hidden"
        >
          {results.map((char, idx) => (
            <button
              key={char.id}
              type="button"
              onClick={() => handleSelect(char)}
              onMouseEnter={() => setHighlightIdx(idx)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                font-(family-name:--font-crimson) text-sm
                transition-colors duration-100
                ${idx === highlightIdx
                  ? "bg-gold/10 text-gold"
                  : "text-amber-100/60 hover:bg-white/5 hover:text-amber-100/80"
                }
              `}
            >
              {char.imageUrl ? (
                <img
                  src={char.imageUrl}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover border border-gold/20"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold/40 text-xs">
                  ?
                </div>
              )}
              <span>{char.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
