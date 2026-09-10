import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { Language, SUPPORTED_LANGUAGES, LanguageOption } from "../lib/translations";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  className?: string;
  variant?: "header" | "pill" | "minimal";
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
  className = "",
  variant = "header"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeOption: LanguageOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    onLanguageChange(code);
    try {
      localStorage.setItem("gtc_selected_language", code);
    } catch {
      // ignore storage errors
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Change Language (Current: ${activeOption.nativeName})`}
        className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-[#7A7468] hover:text-[#C5A059] bg-white border border-[#E5E0D5] hover:border-[#C5A059] rounded-full flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
      >
        <Globe className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
        <span className="text-sm leading-none shrink-0">{activeOption.flag}</span>
        <span className="font-bold tracking-wider">{activeOption.code.toUpperCase()}</span>
        <ChevronDown
          className={`w-3 h-3 text-[#7A7468] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-56 sm:w-64 max-h-80 overflow-y-auto bg-white rounded-2xl shadow-xl border border-[#E5E0D5] py-2 z-50 focus:outline-none divide-y divide-[#F5F2EB] animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="px-3.5 py-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059] font-serif">
              Select Sanctuary Language
            </p>
            <p className="text-[11px] text-[#7A7468]">
              {SUPPORTED_LANGUAGES.length} languages available
            </p>
          </div>

          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  type="button"
                  role="menuitem"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#F9F7F2] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#F7F4EC] text-[#2D2D2D] font-bold"
                      : "text-[#4A4438]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-[#2D2D2D]">
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-[#8A8478]">
                        {lang.name} ({lang.code.toUpperCase()})
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#C5A059] stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
