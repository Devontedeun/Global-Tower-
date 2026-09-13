import React, { useState, useEffect } from "react";
import {
  User,
  X,
  Mail,
  ShieldCheck,
  Globe,
  Bell,
  Check,
  ExternalLink,
  BookOpen,
  Heart,
  Save,
  LogOut,
  UserCheck,
  Sparkles,
  Phone,
  Palette,
  Trash2,
  ShieldAlert,
  AtSign,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Download
} from "lucide-react";
import { UserProfile, UserRole } from "../types";
import { Storage, isSuperAdminEmail } from "../lib/storage";
import { UserDataService } from "../lib/userDataService";
import { useAuth } from "../lib/AuthContext";
import { UserAvatar, getInitials } from "./UserAvatar";
import { usePWAInstall } from "../lib/usePWAInstall";
import { Language, SUPPORTED_LANGUAGES } from "../lib/translations";
import { DeleteAccountModal } from "./DeleteAccountModal";
import { ThemeToggle, SanctuaryColorPicker } from "./ThemeToggle";
import { UserFriendlyMetrics } from "./UserFriendlyMetrics";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onOpenAuthPortal?: () => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  onNavigate?: (view: string) => void;
}

const COLOR_BLOCK_OPTIONS = [
  { id: "gold", label: "Apostolic Gold", bg: "bg-[#C5A059]", text: "text-white" },
  { id: "charcoal", label: "Charcoal Slate", bg: "bg-[#2D2D2D]", text: "text-[#FAF6EE]" },
  { id: "amber", label: "Warm Amber", bg: "bg-[#7A5C3E]", text: "text-white" },
  { id: "sage", label: "Forest Sage", bg: "bg-[#4A6B5D]", text: "text-white" },
  { id: "blue", label: "Regal Blue", bg: "bg-[#3D5A80]", text: "text-white" },
  { id: "terracotta", label: "Terracotta", bg: "bg-[#8D5B4C]", text: "text-white" },
  { id: "taupe", label: "Taupe Stone", bg: "bg-[#5E503F]", text: "text-white" },
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onOpenAuthPortal,
  language = "en",
  onLanguageChange,
  onNavigate
}) => {
  const { currentUser, logout, updateProfileData } = useAuth();

  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username || "");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [usernameFeedback, setUsernameFeedback] = useState<string | null>(null);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [country, setCountry] = useState(user.country || "Global");
  const [role, setRole] = useState<UserRole>(user.role);
  const [selectedColorBg, setSelectedColorBg] = useState<string>(
    user.avatarUrl && user.avatarUrl.startsWith("bg-") ? user.avatarUrl : "bg-[#C5A059]"
  );
  const [dailyScripture, setDailyScripture] = useState(user.notificationPrefs?.dailyScripture ?? true);
  const [newSermons, setNewSermons] = useState(user.notificationPrefs?.newSermons ?? true);
  const [liveEvents, setLiveEvents] = useState(user.notificationPrefs?.liveEvents ?? true);
  const [savedMsg, setSavedMsg] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [barTheme, setBarTheme] = useState<string>(() => {
    try {
      return localStorage.getItem('gtc_webapp_bar_theme') || 'gold';
    } catch {
      return 'gold';
    }
  });

  const handleBarThemeSelect = (themeId: string) => {
    setBarTheme(themeId);
    try {
      localStorage.setItem('gtc_webapp_bar_theme', themeId);
      window.dispatchEvent(new Event('storage'));
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      const colors: Record<string, string> = {
        gold: '#C5A059',
        obsidian: '#1A1815',
        linen: '#FDFCF9',
        bronze: '#8C6228'
      };
      if (metaTheme && colors[themeId]) {
        metaTheme.setAttribute('content', colors[themeId]);
      }
    } catch {}
  };

  useEffect(() => {
    setName(user.name || "");
    setUsername(user.username || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
    setCountry(user.country || "Global");
    setRole(user.role);
    if (user.avatarUrl && user.avatarUrl.startsWith("bg-")) {
      setSelectedColorBg(user.avatarUrl);
    }
  }, [user]);

  // Real-time username verification on profile edit
  useEffect(() => {
    const clean = username.trim().toLowerCase().replace(/^@/, "");
    if (!clean || clean === (user.username || "").toLowerCase()) {
      setUsernameStatus("idle");
      setUsernameFeedback(null);
      return;
    }
    if (clean.length < 3) {
      setUsernameStatus("taken");
      setUsernameFeedback("Username must be at least 3 characters.");
      return;
    }
    if (!/^[a-z0-9_.-]+$/.test(clean)) {
      setUsernameStatus("taken");
      setUsernameFeedback("Letters, numbers, underscores, dashes, and periods only.");
      return;
    }

    const localCheck = Storage.isUsernameTaken(clean, user.id);
    if (localCheck) {
      setUsernameStatus("taken");
      setUsernameFeedback(`@${clean} is already claimed.`);
      return;
    }

    setUsernameStatus("checking");
    setUsernameFeedback("Checking availability...");

    const timer = setTimeout(async () => {
      try {
        const check = await UserDataService.isUsernameTaken(clean, user.id);
        if (check.taken) {
          setUsernameStatus("taken");
          setUsernameFeedback(check.reason || `@${clean} is already claimed.`);
        } else {
          setUsernameStatus("available");
          setUsernameFeedback(`@${clean} is available!`);
        }
      } catch {
        setUsernameStatus("available");
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [username, user.username, user.id]);

  if (!isOpen) return null;

  const isSuperAdmin =
    user.role === "super_admin" ||
    isSuperAdminEmail(user.email);

  const handleSave = async () => {
    setSaveError(null);
    const finalRole: UserRole = isSuperAdmin ? "super_admin" : "user";
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, "");

    if (cleanUsername && cleanUsername !== (user.username || "").toLowerCase()) {
      if (cleanUsername.length < 3) {
        setSaveError("Sanctuary username must be at least 3 characters.");
        return;
      }
      const check = await UserDataService.isUsernameTaken(cleanUsername, user.id);
      if (check.taken) {
        setSaveError(check.reason || `Username '@${cleanUsername}' is already claimed by another believer.`);
        return;
      }
    }

    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      username: cleanUsername || user.username,
      email: email.trim() || user.email,
      phoneNumber: phoneNumber.trim(),
      country: country.trim() || "Global",
      role: finalRole,
      avatarUrl: selectedColorBg,
      notificationPrefs: {
        ...user.notificationPrefs,
        dailyScripture,
        newSermons,
        liveEvents
      }
    };
    
    // Save to local Storage
    Storage.setUser(updated);
    
    // Save to Firestore & Auth profile
    try {
      await updateProfileData(updated);
    } catch (e: any) {
      setSaveError(e.message || "Failed to update profile.");
      return;
    }
    
    onUpdateUser(updated);
    setSavedMsg(true);
    setTimeout(() => {
      setSavedMsg(false);
      onClose();
    }, 900);
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1C1B18]/60 backdrop-blur-xs animate-fadeIn"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div
          className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-[32px] p-4 sm:p-8 shadow-2xl border border-[#E5E0D5] max-h-[88vh] max-h-[88dvh] overflow-y-auto overflow-x-hidden"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D5]">
          <div className="flex items-center gap-3.5">
            <UserAvatar
              name={name || user.name}
              size="lg"
              bgColor={selectedColorBg}
              className="border-2 border-[#C5A059]"
            />
            <div>
              <h3 className="font-serif font-bold text-[#2D2D2D] text-xl">{name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2.5 py-0.5 rounded-full border border-[#E5E0D5] uppercase tracking-wider font-serif">
                  {isSuperAdmin ? "Apostle / Super Admin" : "Beloved Brethren"}
                </span>
                {currentUser && (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Active Member</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8A8478] hover:text-[#2D2D2D] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mt-5 text-xs">
          {/* Avatar Color Block Palette Picker */}
          <div className="p-3.5 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D2D2D] font-serif flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Initials Color Block</span>
              </span>
              <span className="text-[11px] text-[#8A8478] font-sans">Initials: <strong>{getInitials(name || user.name)}</strong></span>
            </div>

            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
              {COLOR_BLOCK_OPTIONS.map((item) => {
                const isSelected = selectedColorBg === item.bg;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedColorBg(item.bg)}
                    className={`relative w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-serif font-bold text-xs transition-all cursor-pointer ${item.bg} ${item.text} ${
                      isSelected ? "ring-3 ring-[#C5A059] scale-110 shadow-xs" : "opacity-80 hover:opacity-100"
                    }`}
                    title={item.label}
                  >
                    <span>{getInitials(name || user.name)}</span>
                    {isSelected && (
                      <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Session Status */}
          {currentUser && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <span className="font-medium truncate">Logged in as: <strong className="font-semibold">{currentUser.email}</strong></span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-rose-700 font-bold hover:underline cursor-pointer ml-2 shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Profile fields */}
          <div>
            <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Sanctuary Username / Handle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#2D2D2D] block font-serif text-xs">
                Sanctuary Username / Handle
              </label>
              <span className="text-[10px] text-[#8A8478]">Unique identifier</span>
            </div>
            <div className="relative">
              <AtSign className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                placeholder="e.g. believer_faith"
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
                className={`w-full pl-10 pr-10 py-3 bg-[#F9F7F2] border rounded-xl font-medium focus:outline-none focus:bg-white transition-all text-xs font-sans ${
                  usernameStatus === "taken"
                    ? "border-rose-400 focus:border-rose-500 bg-rose-50/20"
                    : usernameStatus === "available"
                    ? "border-emerald-400 focus:border-emerald-500 bg-emerald-50/20"
                    : "border-[#E5E0D5] focus:border-[#C5A059]"
                }`}
              />
              <div className="absolute right-3.5 top-3.5">
                {usernameStatus === "checking" && (
                  <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                )}
                {usernameStatus === "available" && (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                )}
                {usernameStatus === "taken" && (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>
            </div>
            {usernameFeedback && (
              <p
                className={`mt-1 text-[11px] font-medium ${
                  usernameStatus === "taken"
                    ? "text-rose-600"
                    : usernameStatus === "available"
                    ? "text-emerald-700"
                    : "text-amber-700"
                }`}
              >
                {usernameFeedback}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Email Address</label>
              <input
                type="email"
                value={email}
                disabled={!!currentUser}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all font-sans ${
                  currentUser ? "opacity-75 cursor-not-allowed" : ""
                }`}
              />
            </div>

            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all font-sans"
            />
          </div>

          {/* Account Role Display */}
          <div>
            {isSuperAdmin ? (
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Ministry Leadership Role</label>
                <div className="w-full p-3 bg-[#FAF6EE] border border-[#C5A059]/40 rounded-xl font-bold text-[#8C6B2D] font-serif flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                    <span>Apostolic Founder (Super Admin)</span>
                  </div>
                  <span className="text-[10px] bg-[#C5A059] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-sans font-bold">Admin</span>
                </div>
              </div>
            ) : (
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">Sanctuary Fellowship Role</label>
                <div className="w-full p-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium text-[#7A7468] font-sans flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#C5A059]" />
                    <span className="font-serif font-bold text-[#2D2D2D]">Beloved Brethren</span>
                  </div>
                  <span className="text-xs bg-[#FAF6EE] text-[#8C6B2D] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30 font-bold">Fellowship Member</span>
                </div>
              </div>
            )}
          </div>

          {/* Language Selection */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#2D2D2D] block font-serif">Sanctuary Language</label>
              <span className="text-[11px] text-[#C5A059] font-semibold">{SUPPORTED_LANGUAGES.length} Languages</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((l) => {
                const isSelected = (language || "en") === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => onLanguageChange && onLanguageChange(l.code)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF6EE] border-[#C5A059] text-[#2D2D2D] shadow-2xs font-bold"
                        : "bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:border-[#C5A059] hover:bg-white"
                    }`}
                  >
                    <span className="text-base leading-none shrink-0">{l.flag}</span>
                    <div className="min-w-0">
                      <div className="text-xs truncate">{l.nativeName}</div>
                      <div className="text-[10px] text-[#8A8478] truncate">{l.code.toUpperCase()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2.5">
            <span className="font-bold text-[#2D2D2D] block font-serif">Ministry Reminders & Notifications</span>
            <label className="flex items-center justify-between p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] cursor-pointer">
              <span className="font-sans text-[#2D2D2D]">Daily Scripture & Devotional reminder</span>
              <input
                type="checkbox"
                checked={dailyScripture}
                onChange={(e) => setDailyScripture(e.target.checked)}
                className="w-4 h-4 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] cursor-pointer">
              <span className="font-sans text-[#2D2D2D]">New Sermon Releases & Teachings</span>
              <input
                type="checkbox"
                checked={newSermons}
                onChange={(e) => setNewSermons(e.target.checked)}
                className="w-4 h-4 text-[#C5A059] accent-[#C5A059] rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Spiritual Journey & Activity Summary */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D2D2D] block font-serif">Spiritual Walk & Activity Summary</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#8C6B2D] border border-[#C5A059]/30">
                Live Walk
              </span>
            </div>
            <UserFriendlyMetrics
              compact
              onNavigate={(view, data) => {
                onClose();
                if (onNavigate) onNavigate(view);
              }}
            />
          </div>

          {/* Global Application Theme: Light vs Midnight Sanctuary */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D2D2D] block font-serif">Sanctuary Appearance & Global Theme</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#C5A059]/15 text-[#8C6B2D] border border-[#C5A059]/30">
                System Wide
              </span>
            </div>
            <p className="text-xs text-[#7A7468]">
              Switch between the daytime Sacred Ivory Linen theme and the reverent Midnight Sanctuary dark theme with deep navy and charcoal tones.
            </p>
            <div className="pt-1 space-y-4">
              <ThemeToggle variant="cards" />
              <div className="pt-3 border-t border-[#F2EFE8] dark:border-slate-800">
                <SanctuaryColorPicker />
              </div>
            </div>
          </div>

          {/* Web App & Status Bar Configuration */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#2D2D2D] block font-serif">Web App & Top Bar Fitting</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isInstalled ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-[#C5A059]/15 text-[#8C6B2D] border border-[#C5A059]/30"
              }`}>
                {isInstalled ? "✦ Standalone Web App" : "Browser Display"}
              </span>
            </div>
            <p className="text-xs text-[#7A7468]">
              Provides the best color bar from our sanctuary palette to frame and fit the web app seamlessly against device notches and status bars.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: "gold", name: "Royal Kingdom Gold", hex: "#C5A059" },
                { id: "obsidian", name: "Sanctuary Obsidian", hex: "#1A1815" },
                { id: "linen", name: "Sacred Linen", hex: "#FDFCF9" },
                { id: "bronze", name: "Imperial Bronze", hex: "#8C6228" }
              ].map((th) => {
                const isSelected = barTheme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => handleBarThemeSelect(th.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FAF6EE] border-[#C5A059] font-bold text-[#2D2D2D] shadow-2xs"
                        : "bg-[#F9F7F2] border-[#E5E0D5] text-[#7A7468] hover:border-[#C5A059]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: th.hex }} />
                      <span className="text-xs">{th.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C5A059]" />}
                  </button>
                );
              })}
            </div>

            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="mt-2 w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Install Global Tower as Web App</span>
              </button>
            )}
          </div>

          {/* Ministry Founder Card */}
          <div className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-[24px] space-y-1">
            <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider font-serif">Ministry Leadership</span>
            <div className="font-bold text-[#2D2D2D] font-serif">GLOBAL TOWER OF CHRIST</div>
            <p className="text-[#7A7468] font-sans">
              Founder: <strong className="text-[#2D2D2D]">Apostle R.Sango</strong>
            </p>
            <p className="text-[#7A7468] font-sans">
              Direct Inquiries: <a href="mailto:info@globaltowerofchrist.com" className="text-[#C5A059] font-semibold underline">info@globaltowerofchrist.com</a>
            </p>
            {onNavigate && (
              <div className="pt-2 flex items-center gap-3 text-[11px] text-[#8A8478] border-t border-[#E5E0D5]/60 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate("privacy");
                  }}
                  className="text-[#C5A059] hover:underline cursor-pointer font-medium"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate("terms");
                  }}
                  className="text-[#C5A059] hover:underline cursor-pointer font-medium"
                >
                  Terms & Conditions (TAC)
                </button>
              </div>
            )}
          </div>

          {/* Account Management & Deletion (Right to Erasure) */}
          <div className="pt-4 border-t border-[#E5E0D5] space-y-2">
            <span className="font-bold text-[#2D2D2D] block font-serif text-sm">Account Management & Sacred Privacy</span>
            <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-[20px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-rose-950 font-serif flex items-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Permanent Account Deletion</span>
                </div>
                <p className="text-[11px] text-[#7A7468] font-sans leading-relaxed">
                  Exercise your Right to Erasure. Permanently delete your account, spiritual reflections, dream journal, and study progress.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-full transition-colors shrink-0 inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {saveError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D5]">
            {savedMsg ? (
              <span className="text-xs font-bold text-emerald-600">Saved successfully!</span>
            ) : <span />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7A7468] hover:bg-[#F9F7F2] rounded-full cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Account Deletion Confirmation Modal */}
    {showDeleteModal && (
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        user={user}
        onNavigate={onNavigate}
      />
    )}
  </>
);
};

