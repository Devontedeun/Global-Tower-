import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../lib/usePWAInstall';
import { Download, Sparkles, Smartphone, Check, X, Shield, Share, PlusSquare } from 'lucide-react';

export type WebAppBarTheme = 'gold' | 'obsidian' | 'linen' | 'bronze';

interface WebAppTopBarProps {
  onInstallStateChange?: (installed: boolean) => void;
  className?: string;
}

const BAR_THEMES: Record<WebAppBarTheme, {
  name: string;
  barClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  buttonClass: string;
  hex: string;
}> = {
  gold: {
    name: 'Royal Kingdom Gold',
    barClass: 'bg-gradient-to-r from-[#9E7A31] via-[#C5A059] to-[#D4AF37]',
    borderClass: 'border-b border-[#997732]/40 shadow-xs',
    textClass: 'text-[#1F1A10]',
    badgeClass: 'bg-[#1F1A10]/15 text-[#1F1A10] border border-[#1F1A10]/20',
    buttonClass: 'bg-[#1F1A10] text-[#FDFCF9] hover:bg-[#12100A] active:scale-95 shadow-xs',
    hex: '#C5A059'
  },
  obsidian: {
    name: 'Sanctuary Obsidian & Gold',
    barClass: 'bg-gradient-to-r from-[#171513] via-[#23201C] to-[#1A1815]',
    borderClass: 'border-b border-[#C5A059]/40 shadow-xs',
    textClass: 'text-[#FDFCF9]',
    badgeClass: 'bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/30',
    buttonClass: 'bg-[#C5A059] text-[#1A1815] hover:bg-[#B48F48] active:scale-95 shadow-xs font-semibold',
    hex: '#1A1815'
  },
  linen: {
    name: 'Sacred Linen & Gold',
    barClass: 'bg-gradient-to-r from-[#FDFCF9] via-[#F6F3EC] to-[#FDFCF9]',
    borderClass: 'border-b border-[#E5E0D5] shadow-xs',
    textClass: 'text-[#2D2D2D]',
    badgeClass: 'bg-[#C5A059]/15 text-[#8C6B2D] border border-[#C5A059]/30',
    buttonClass: 'bg-[#C5A059] text-white hover:bg-[#B48F48] active:scale-95 shadow-xs',
    hex: '#F9F7F2'
  },
  bronze: {
    name: 'Imperial Bronze',
    barClass: 'bg-gradient-to-r from-[#704F22] via-[#8C6228] to-[#99702F]',
    borderClass: 'border-b border-[#5E3F18] shadow-xs',
    textClass: 'text-[#FAF5ED]',
    badgeClass: 'bg-black/20 text-[#F6E7D0] border border-white/20',
    buttonClass: 'bg-[#FAF5ED] text-[#704F22] hover:bg-white active:scale-95 shadow-xs font-bold',
    hex: '#8C6228'
  }
};

export const WebAppTopBar: React.FC<WebAppTopBarProps> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<WebAppBarTheme>(() => {
    try {
      const saved = localStorage.getItem('gtc_webapp_bar_theme') as WebAppBarTheme;
      if (saved && BAR_THEMES[saved]) return saved;
    } catch {}
    return 'gold'; // Default to the site's signature Royal Kingdom Gold
  });

  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('gtc_webapp_bar_dismissed') === 'true';
    } catch {
      return false;
    }
  });

  // Keep HTML meta theme-color synchronized with the chosen bar color
  useEffect(() => {
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    const activeColor = BAR_THEMES[selectedTheme].hex;
    if (metaTheme) {
      metaTheme.setAttribute('content', activeColor);
    }
    try {
      localStorage.setItem('gtc_webapp_bar_theme', selectedTheme);
    } catch {}
  }, [selectedTheme]);

  const handleSelectTheme = (theme: WebAppBarTheme) => {
    setSelectedTheme(theme);
    setIsThemePickerOpen(false);
  };

  const themeConfig = BAR_THEMES[selectedTheme];

  return (
    <>
      {/* 
        The Web App Top Bar:
        - Incorporates pt-[env(safe-area-inset-top,0px)] so it hugs the mobile notch / camera cutout / status bar perfectly.
        - Provides the signature site color bar so when made into a web app, the UI fits seamlessly without clipping.
      */}
      <aside
        aria-label="Web App Status Bar"
        className={`w-full transition-colors duration-300 relative z-50 select-none ${themeConfig.barClass} ${themeConfig.borderClass} ${className}`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        <div className="w-full px-3 sm:px-6 h-8 sm:h-9 flex items-center justify-between gap-2 text-xs">
          {/* Left: Ministry Crest & Web App Status Indicator */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Cross / Crown insignia */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full ${selectedTheme === 'gold' ? 'bg-[#1F1A10]/15' : 'bg-[#C5A059]/20'}`}>
                <Sparkles className="w-2.5 h-2.5 text-current opacity-90" />
              </span>
              <span className={`font-serif tracking-widest text-[11px] sm:text-xs font-bold uppercase truncate ${themeConfig.textClass}`}>
                Global Tower of Christ
              </span>
            </div>

            {/* Standalone Web App Indicator */}
            {isInstalled ? (
              <span className={`hidden xs:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${themeConfig.badgeClass}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Sanctuary</span> Web App Active
              </span>
            ) : (
              <span className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide opacity-85 ${themeConfig.badgeClass}`}>
                Worship • Dominion • Victory
              </span>
            )}
          </div>

          {/* Right: Actions & Theme Picker */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Color Palette Switcher Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer ${
                  selectedTheme === 'gold'
                    ? 'border-[#1F1A10]/20 bg-[#1F1A10]/10 text-[#1F1A10] hover:bg-[#1F1A10]/20'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Change Web App Bar Theme Color"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-2xs"
                  style={{ backgroundColor: themeConfig.hex }}
                />
                <span className="hidden sm:inline font-sans">{themeConfig.name.split(' ')[0]}</span>
                <span className="text-[8px] opacity-70">▾</span>
              </button>

              {/* Theme Dropdown Menu */}
              {isThemePickerOpen && (
                <div
                  className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-[#E5E0D5] p-2 z-50 text-[#2D2D2D] animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8A8478] border-b border-[#E5E0D5]/70 mb-1">
                    Web App Bar Color
                  </div>
                  {(Object.keys(BAR_THEMES) as WebAppBarTheme[]).map((key) => {
                    const item = BAR_THEMES[key];
                    const isSelected = selectedTheme === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectTheme(key)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                          isSelected ? 'bg-[#F9F7F2] text-[#C5A059] font-bold' : 'hover:bg-[#F9F7F2] text-[#2D2D2D]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-[#E5E0D5] shadow-2xs shrink-0"
                            style={{ backgroundColor: item.hex }}
                          />
                          <span className="text-xs">{item.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Install / Make a Web App Button (if not yet in standalone mode) */}
            {!isInstalled && (
              <>
                {isInstallable ? (
                  <button
                    type="button"
                    onClick={install}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${themeConfig.buttonClass}`}
                    title="Install Global Tower as a Web App on your home screen"
                  >
                    <Download className="w-3 h-3" />
                    <span>Make Web App</span>
                  </button>
                ) : isIOS ? (
                  <button
                    type="button"
                    onClick={() => setShowIOSModal(true)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${themeConfig.buttonClass}`}
                    title="Install on iPhone / iPad"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Make Web App</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowIOSModal(true)}
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${themeConfig.buttonClass}`}
                    title="Add to Home Screen / Install Guide"
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Web App Guide</span>
                  </button>
                )}
              </>
            )}

            {/* In Standalone Mode: Fitted status pill */}
            {isInstalled && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${themeConfig.badgeClass}`}>
                <Shield className="w-3 h-3 text-[#1F1A10]" />
                <span className="text-[9px]">Fitted UI</span>
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* iOS Safari / Universal Installation Instructions Modal */}
      {showIOSModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
          onClick={() => setShowIOSModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] p-6 shadow-2xl relative text-[#2D2D2D] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-[#8A8478] hover:text-[#2D2D2D] hover:bg-[#F9F7F2] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9E7A31] via-[#C5A059] to-[#D4AF37] flex items-center justify-center text-[#1F1A10] shadow-md shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2D2D2D]">
                  Make This a Web App
                </h3>
                <p className="text-xs text-[#7A7468]">
                  Install Global Tower of Christ directly to your device home screen
                </p>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-3.5 text-xs text-[#4A4438] bg-white p-4 rounded-xl border border-[#E5E0D5]">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <span className="font-semibold text-[#2D2D2D]">Open in Safari or Chrome</span>
                  <p className="text-[11px] text-[#7A7468] mt-0.5">
                    Navigate to this site using your device's primary browser.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#2D2D2D]">
                    <span>Tap the Share or Menu icon</span>
                    <Share className="w-3.5 h-3.5 text-[#C5A059]" />
                  </div>
                  <p className="text-[11px] text-[#7A7468] mt-0.5">
                    In Safari, tap the Share icon at the bottom toolbar. In Chrome, tap the three dots in the top right.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#2D2D2D]">
                    <span>Select "Add to Home Screen"</span>
                    <PlusSquare className="w-3.5 h-3.5 text-[#C5A059]" />
                  </div>
                  <p className="text-[11px] text-[#7A7468] mt-0.5">
                    Scroll down and tap <strong>"Add to Home Screen"</strong> or <strong>"Install App"</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#C5A059]/15 text-[#8C6B2D] font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div>
                  <span className="font-semibold text-[#2D2D2D]">Launch as a Native-Fit Web App</span>
                  <p className="text-[11px] text-[#7A7468] mt-0.5">
                    Open the icon from your Home Screen. It launches full-screen with the custom Royal Gold bar fitting your display notch and safe areas!
                  </p>
                </div>
              </div>
            </div>

            {/* Fitted UI highlight */}
            <div className="mt-3.5 p-2.5 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center gap-2 text-[11px] text-[#8C6B2D]">
              <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>
                Includes custom Royal Kingdom Gold status bar, safe-area notch alignment, and full touch layout.
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 bg-[#C5A059] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#B48F48] transition-colors cursor-pointer shadow-sm"
              >
                Got It, Thank You
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
