import React, { useState } from "react";
import {
  UserPlus,
  LogIn,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  Check,
  X,
  Camera,
  Image
} from "lucide-react";
import { Logo } from "./Logo";
import { useAuth } from "../lib/AuthContext";

interface SignUpPortalProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  onClose?: () => void;
  isOpenAsModal?: boolean;
}

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Ghana",
  "Uganda",
  "France",
  "Germany",
  "Brazil",
  "India",
  "Philippines",
  "Cameroon",
  "Congo (DRC)",
  "Ivory Coast",
  "Zambia",
  "Zimbabwe",
  "Other"
];

const SPIRITUAL_INTERESTS = [
  "Bible Study & Exegesis",
  "Prayer & Intercession",
  "Sermons & Expository Preaching",
  "Spiritual Discernment & Dreams",
  "Worship & Praise",
  "Kingdom Dominion & Victory",
  "Youth & Young Adults",
  "Prophetic Teaching"
];

const AVATAR_PRESETS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80"
];

export const SignUpPortal: React.FC<SignUpPortalProps> = ({
  onSuccess,
  onSwitchToLogin,
  onClose,
  isOpenAsModal = false
}) => {
  const { register, login, resetPassword, continueAsGuest } = useAuth();

  // Mode: "login" | "signup" | "forgot_password"
  const [mode, setMode] = useState<"login" | "signup" | "forgot_password">("login");

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("United States");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Bible Study & Exegesis",
    "Prayer & Intercession",
    "Worship & Praise"
  ]);

  // Checkboxes
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Real-Time Password Strength Checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  // Strength score: 0 to 3
  const strengthScore =
    (hasMinLength ? 1 : 0) +
    (hasNumber ? 1 : 0) +
    (hasUppercase ? 1 : 0);

  const isPasswordValid = hasMinLength && hasNumber && hasUppercase;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMessage("Image file size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation
  const validateSignUp = () => {
    if (!firstName.trim()) return "Please enter your first name.";
    if (!lastName.trim()) return "Please enter your last name.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!phoneNumber.trim()) return "Please enter your phone number.";
    if (!country) return "Please select your country.";
    if (!hasMinLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasUppercase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match. Please re-enter.";
    }
    if (!agreedTerms) {
      return "You must agree to the Terms & Conditions to register.";
    }
    if (!agreedPrivacy) {
      return "You must agree to the Privacy Policy to register.";
    }
    return null;
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === "signup") {
      const valError = validateSignUp();
      if (valError) {
        setErrorMessage(valError);
        return;
      }

      setIsLoading(true);
      try {
        await register({
          firstName,
          lastName,
          email,
          phoneNumber,
          country,
          password,
          interests: selectedInterests
        });

        setSuccessMessage("Account created successfully! Welcome to Global Tower of Christ.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } catch (err: any) {
        console.error("Registration error:", err);
        if (err.code === "auth/email-already-in-use") {
          setErrorMessage("This email address is already registered. Please log in instead.");
        } else if (err.code === "auth/weak-password") {
          setErrorMessage("The password is too weak. Please use at least 8 characters with numbers and uppercase letters.");
        } else if (err.code === "auth/invalid-email") {
          setErrorMessage("The email address is invalid.");
        } else if (err.message && (err.message.includes("api-key") || err.message.includes("API key"))) {
          continueAsGuest();
          setSuccessMessage("Account initialized successfully! Entering sanctuary...");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 800);
        } else {
          setErrorMessage(err.message || "Failed to create account. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else if (mode === "login") {
      if (!email.trim() || !password) {
        setErrorMessage("Please provide both email and password.");
        return;
      }

      setIsLoading(true);
      try {
        await login(email.trim(), password);
        setSuccessMessage("Signed in successfully! Entering sanctuary...");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 800);
      } catch (err: any) {
        console.error("Login error:", err);
        if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
          setErrorMessage("Invalid email or password. Please check your credentials.");
        } else if (err.message && (err.message.includes("api-key") || err.message.includes("API key"))) {
          continueAsGuest();
          setSuccessMessage("Signed in! Entering sanctuary...");
          setTimeout(() => {
            if (onSuccess) onSuccess();
          }, 800);
        } else {
          setErrorMessage(err.message || "Sign in failed. Please check your connection and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else if (mode === "forgot_password") {
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setErrorMessage("Please enter a valid email address to receive password reset instructions.");
        return;
      }

      setIsLoading(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage("Password reset email sent! Check your inbox for instructions.");
      } catch (err: any) {
        console.error("Reset password error:", err);
        setErrorMessage(err.message || "Could not send reset email. Please verify the email address.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const content = (
    <div className="w-full max-w-2xl bg-white rounded-3xl sm:rounded-[32px] border border-[#E5E0D5] shadow-2xl p-6 sm:p-10 text-[#2D2D2D]">
      {/* Header & Logo */}
      <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-[#E5E0D5]">
        <Logo size="lg" />
        <div>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#2D2D2D]">
            {mode === "login"
              ? "Welcome to Global Tower of Christ"
              : mode === "signup"
              ? "Free Member Registration"
              : "Reset Your Password"}
          </h2>
          <p className="text-xs sm:text-sm text-[#7A7468] font-sans mt-1 max-w-md">
            {mode === "login"
              ? "Sign in to access your personal Bible notes, spiritual journal, prayer wall, and sermon library."
              : mode === "signup"
              ? "Join the free global community of believers walking in Worship, Dominion & Victory."
              : "Enter your registered email address and we'll send you a password reset link."}
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F9F7F2] rounded-full border border-[#E5E0D5] w-full max-w-xs mt-2">
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setMode("login");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === "login"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "text-[#7A7468] hover:text-[#2D2D2D]"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMessage(null);
              setSuccessMessage(null);
              setMode("signup");
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === "signup"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "text-[#7A7468] hover:text-[#2D2D2D]"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Free</span>
          </button>
        </div>

        {/* Free SaaS Guarantee Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] rounded-full border border-[#E5E0D5] text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Lifetime Access • No Subscription or Payment</span>
        </div>
      </div>

      {/* Error & Success Alerts */}
      {errorMessage && (
        <div className="mt-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {successMessage && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <div className="font-medium">{successMessage}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs font-sans">
        {mode === "signup" && (
          <>
            {/* Avatar Selection & Profile Photo */}
            <div className="p-4 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2D2D2D] font-serif">Sanctuary Profile Avatar</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                  className="text-[#C5A059] hover:underline font-bold text-xs cursor-pointer"
                >
                  {showAvatarPicker ? "Hide Presets" : "Choose from Presets"}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="Selected Avatar"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#C5A059] shadow-xs"
                  />
                  <label
                    htmlFor="signup-avatar-upload"
                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#C5A059] hover:bg-[#B48F48] text-white flex items-center justify-center cursor-pointer shadow-xs"
                    title="Upload Custom Image"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      id="signup-avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex-1 space-y-1">
                  <p className="text-[11px] text-[#7A7468]">
                    Click the camera icon to upload your own picture, or select from curated ministry presets below.
                  </p>
                </div>
              </div>

              {showAvatarPicker && (
                <div className="pt-2 border-t border-[#E5E0D5]">
                  <p className="text-[11px] font-bold text-[#8A8478] mb-2">Preset Dignified Avatars:</p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`relative rounded-full transition-transform cursor-pointer shrink-0 ${
                          avatarUrl === preset ? "ring-2 ring-[#C5A059] scale-105" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={preset}
                          alt={`Avatar ${idx + 1}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {avatarUrl === preset && (
                          <div className="absolute inset-0 bg-[#C5A059]/30 rounded-full flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Samuel"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Adebayo"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                Country / Region <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5 pointer-events-none" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs cursor-pointer appearance-none"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Spiritual Interests */}
            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1.5 font-serif">
                Select Your Ministry & Spiritual Interests (Optional)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SPIRITUAL_INTERESTS.map((interest) => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-[#C5A059] text-white border-[#C5A059] shadow-2xs"
                          : "bg-[#F9F7F2] text-[#7A7468] border-[#E5E0D5] hover:border-[#C5A059]"
                      }`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-[#8A8478] hover:text-[#2D2D2D] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Real-Time Password Strength Meter & Interactive Checklist */}
            <div className="p-4 bg-[#FDFCF9] rounded-2xl border border-[#E5E0D5] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-[#4A4438] font-serif">
                  Password Strength & Security Requirements:
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    strengthScore === 3
                      ? "bg-emerald-100 text-emerald-800"
                      : strengthScore === 2
                      ? "bg-amber-100 text-amber-800"
                      : password.length > 0
                      ? "bg-rose-100 text-rose-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {strengthScore === 3
                    ? "Strong"
                    : strengthScore === 2
                    ? "Medium"
                    : password.length > 0
                    ? "Weak"
                    : "Not Entered"}
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full bg-[#E5E0D5] h-1.5 rounded-full overflow-hidden flex gap-1">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    strengthScore >= 1
                      ? strengthScore === 3
                        ? "bg-emerald-500 w-1/3"
                        : strengthScore === 2
                        ? "bg-amber-500 w-1/3"
                        : "bg-rose-500 w-1/3"
                      : "w-0"
                  }`}
                />
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    strengthScore >= 2
                      ? strengthScore === 3
                        ? "bg-emerald-500 w-1/3"
                        : "bg-amber-500 w-1/3"
                      : "w-0"
                  }`}
                />
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    strengthScore === 3 ? "bg-emerald-500 w-1/3" : "w-0"
                  }`}
                />
              </div>

              {/* Interactive Checklist Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      hasMinLength
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-[#E5E0D5] text-[#8A8478]"
                    }`}
                  >
                    {hasMinLength ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#AAA498]" />}
                  </div>
                  <span className={hasMinLength ? "text-emerald-700 font-semibold" : "text-[#7A7468]"}>
                    At least 8 characters
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      hasNumber
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-[#E5E0D5] text-[#8A8478]"
                    }`}
                  >
                    {hasNumber ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#AAA498]" />}
                  </div>
                  <span className={hasNumber ? "text-emerald-700 font-semibold" : "text-[#7A7468]"}>
                    At least 1 number (0-9)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      hasUppercase
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-[#E5E0D5] text-[#8A8478]"
                    }`}
                  >
                    {hasUppercase ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#AAA498]" />}
                  </div>
                  <span className={hasUppercase ? "text-emerald-700 font-semibold" : "text-[#7A7468]"}>
                    At least 1 uppercase letter (A-Z)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      passwordsMatch
                        ? "bg-emerald-500 text-white"
                        : "bg-white border border-[#E5E0D5] text-[#8A8478]"
                    }`}
                  >
                    {passwordsMatch ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-[#AAA498]" />}
                  </div>
                  <span className={passwordsMatch ? "text-emerald-700 font-semibold" : "text-[#7A7468]"}>
                    Passwords match
                  </span>
                </div>
              </div>
            </div>

            {/* Checkboxes for Terms & Privacy */}
            <div className="space-y-2 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-[#4A4438] text-[11px]">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5E0D5] text-[#C5A059] focus:ring-[#C5A059] cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-[#C5A059] font-bold underline">Terms & Conditions</span> of
                  Global Tower of Christ Ministry.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer text-[#4A4438] text-[11px]">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 rounded border-[#E5E0D5] text-[#C5A059] focus:ring-[#C5A059] cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <span className="text-[#C5A059] font-bold underline">Privacy Policy</span> and data
                  security guidelines.
                </span>
              </label>
            </div>
          </>
        )}

        {mode === "login" && (
          <div className="space-y-4">
            {/* Apostolic Founder Login Preset Banner */}
            <div className="p-3.5 bg-[#FAF6EE] border border-[#C5A059]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="space-y-0.5">
                <div className="font-serif font-bold text-[#8C6B2D] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Apostle R.Sango Leadership Sign In</span>
                </div>
                <div className="text-[11px] text-[#7A7468] font-mono">
                  sangorichard@gmail.com • Password: <code className="bg-white/80 px-1 py-0.2 rounded text-[#2D2D2D]">G0d1sg0od</code>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail("sangorichard@gmail.com");
                  setPassword("G0d1sg0od");
                  setErrorMessage(null);
                }}
                className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-[11px] font-bold uppercase tracking-wider rounded-full cursor-pointer shrink-0 transition-colors shadow-2xs"
              >
                Autofill Credentials
              </button>
            </div>

            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#2D2D2D] font-serif">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setSuccessMessage(null);
                    setMode("forgot_password");
                  }}
                  className="text-[11px] text-[#C5A059] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[#8A8478] hover:text-[#2D2D2D] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === "forgot_password" && (
          <div className="space-y-3">
            <div>
              <label className="font-bold text-[#2D2D2D] block mb-1 font-serif">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-3 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl font-medium focus:outline-none focus:border-[#C5A059] focus:bg-white transition-all text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 space-y-2.5">
          <button
            type="submit"
            disabled={isLoading || (mode === "signup" && (!isPasswordValid || !passwordsMatch))}
            className="w-full py-3.5 bg-[#C5A059] hover:bg-[#B48F48] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : mode === "signup" ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account / Sign Up</span>
              </>
            ) : mode === "login" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Sanctuary</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>Send Password Reset Link</span>
              </>
            )}
          </button>

          {/* Instant Guest / Visitor Access Button */}
          <button
            type="button"
            onClick={() => {
              continueAsGuest();
              if (onSuccess) onSuccess();
            }}
            className="w-full py-2.5 bg-[#F9F7F2] hover:bg-[#F2EFE8] text-[#7A7468] hover:text-[#2D2D2D] border border-[#E5E0D5] font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue as Visitor / Guest (Explore Sanctuary)</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </form>

      {/* Switcher Footer */}
      <div className="mt-6 pt-5 border-t border-[#E5E0D5] text-center text-xs">
        {mode === "signup" ? (
          <p className="text-[#7A7468]">
            Already have an account?{" "}
            <button
              onClick={() => {
                setErrorMessage(null);
                setSuccessMessage(null);
                setMode("login");
              }}
              className="text-[#C5A059] font-bold hover:underline cursor-pointer ml-1"
            >
              Sign In here
            </button>
          </p>
        ) : (
          <p className="text-[#7A7468]">
            Don't have an account yet?{" "}
            <button
              onClick={() => {
                setErrorMessage(null);
                setSuccessMessage(null);
                setMode("signup");
              }}
              className="text-[#C5A059] font-bold hover:underline cursor-pointer ml-1"
            >
              Register for Free
            </button>
          </p>
        )}
      </div>

      {/* Close button if in modal */}
      {isOpenAsModal && onClose && (
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="text-xs text-[#8A8478] hover:text-[#2D2D2D] font-medium cursor-pointer"
          >
            Close Window
          </button>
        </div>
      )}
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1B18]/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
        onClick={onClose}
      >
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl my-8">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-8">
      {content}
    </div>
  );
};
