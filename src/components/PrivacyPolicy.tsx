import React, { useState } from "react";
import {
  Shield,
  Lock,
  FileText,
  CheckCircle2,
  ChevronLeft,
  Printer,
  Mail,
  Eye,
  Server,
  Sparkles,
  Heart,
  BookOpen,
  ArrowUpRight,
  Database,
  Trash2
} from "lucide-react";
import { Logo } from "./Logo";

interface PrivacyPolicyProps {
  onBack?: () => void;
  isModal?: boolean;
  onAcceptAndClose?: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  onBack,
  isModal = false,
  onAcceptAndClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", label: "1. Overview & Sanctity" },
    { id: "collection", label: "2. Information Collected" },
    { id: "usage", label: "3. How Data Is Used" },
    { id: "ai-privacy", label: "4. Spiritual Insight AI" },
    { id: "storage", label: "5. Storage & Fresh Start" },
    { id: "rights", label: "6. Brethren Rights" },
    { id: "contact", label: "7. Contact Ministry" },
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`privacy-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const content = (
    <div className="space-y-10 text-[#2D2D2D] leading-relaxed">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#FAF7F0] to-[#F5EFE0] p-6 sm:p-8 rounded-[28px] border border-[#E5E0D5] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-xs rounded-full border border-[#E5E0D5] text-[#C5A059] text-[11px] font-bold uppercase tracking-widest">
              <Shield className="w-3.5 h-3.5" />
              <span>Sacred Privacy & Data Protection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7468]">
              Global Tower of Christ • Under the Apostolic Governance of Apostle R.Sango
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-2 bg-white hover:bg-[#F2EFE8] text-[#2D2D2D] border border-[#E5E0D5] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              title="Print Privacy Policy"
            >
              <Printer className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Print</span>
            </button>
            {onAcceptAndClose && (
              <button
                onClick={onAcceptAndClose}
                type="button"
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Policy</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E5E0D5]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8A8478]">
          <span>Effective Date: September 2026</span>
          <span>Version 2.4 • Applicable Globally</span>
        </div>
      </div>

      {/* Quick Navigation Anchor Bar */}
      <div className="sticky top-2 z-20 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-[#E5E0D5] shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSection === sec.id
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "text-[#7A7468] hover:text-[#2D2D2D] hover:bg-[#F9F7F2]"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Section 1: Overview */}
      <section id="privacy-overview" className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            1
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Overview & Sacred Trust
          </h2>
        </div>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          At <strong>Global Tower of Christ</strong>, we treat your relationship with God and your
          fellowship in this digital sanctuary as a sacred trust. Guided by biblical principles of
          honesty, integrity, and pastoral confidentiality, we are committed to protecting the
          personal information, spiritual reflections, dream journals, and prayer requests shared
          within our platform.
        </p>
        <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5E0D5] flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
          <p className="text-xs text-[#5D574B]">
            <strong>Zero Commercialization Guarantee:</strong> We do not sell, rent, monetize, or
            trade your personal details or spiritual notes to any third-party advertisers or data
            brokers. This ministry platform exists solely for the edification of believers, the
            advancement of the Gospel of Jesus Christ, and deep Bible research.
          </p>
        </div>
      </section>

      {/* Section 2: Information Collected */}
      <section id="privacy-collection" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            2
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Information We Collect
          </h2>
        </div>
        <p className="text-sm text-[#4A4438]">
          To provide personalized scripture research, dream journaling, and prayer fellowship, we
          collect the following categories of information:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2D2D2D]">
              <Eye className="w-4 h-4 text-[#C5A059]" />
              <span>Personal Account Details</span>
            </div>
            <p className="text-[#7A7468]">
              Your name, email address, chosen title/role, profile avatar, language preference, and
              optional interests in biblical themes (e.g., Prophecy, Spiritual Warfare, Faith,
              Dreams & Visions).
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2D2D2D]">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>Biblical Study & Journal Data</span>
            </div>
            <p className="text-[#7A7468]">
              Scripture bookmarks, highlights, personal study notes, dream and vision journal
              records, symbols explored, and progress across the interactive study plans.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2D2D2D]">
              <Heart className="w-4 h-4 text-[#C5A059]" />
              <span>Prayer Requests & Testimonies</span>
            </div>
            <p className="text-[#7A7468]">
              Prayer items you submit, prayer updates, and testimony entries. You retain full control
              over whether a prayer request is personal or shared with the fellowship.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#2D2D2D]">
              <Server className="w-4 h-4 text-[#C5A059]" />
              <span>App State & Audio Preferences</span>
            </div>
            <p className="text-[#7A7468]">
              Audio playback speed, chosen Bible narrators, watch progress on apostolic broadcasts,
              and youth quiz completions.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Usage */}
      <section id="privacy-usage" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            3
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            How We Use Your Information
          </h2>
        </div>
        <ul className="space-y-2.5 text-sm text-[#4A4438]">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span><strong>Scripture Edification:</strong> Storing and synchronizing your personal Bible highlights, notes, and study bookmarks across your devices.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span><strong>Spiritual Inquiry Assistance:</strong> Enabling the Biblical Doctrine Engine to answer theological questions with canonical references.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span><strong>Dream & Vision Hermeneutics:</strong> Allowing you to record nocturnal revelations and correlate them with biblical symbolism.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <span><strong>Community Fellowship & Prayer:</strong> Maintaining intercessory prayer chains and sharing uplifting apostolic words of encouragement.</span>
          </li>
        </ul>
      </section>

      {/* Section 4: AI Privacy */}
      <section id="privacy-ai-privacy" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            4
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Spiritual Insight AI & Analytical Privacy
          </h2>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#E5E0D5] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D]">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Private & Isolated Scripture Query Processing</span>
          </div>
          <p className="text-xs text-[#5D574B] leading-relaxed">
            When you inquire about doctrine or request dream symbolism analysis through our
            Spiritual Insight Engine, the text prompt is processed strictly server-side using secure,
            encrypted API protocols.
          </p>
          <ul className="text-xs text-[#5D574B] space-y-1.5 list-disc list-inside">
            <li>Your queries are not used to train public commercial AI models.</li>
            <li>No personal identification or contact details are transmitted alongside doctrinal research prompts.</li>
            <li>All AI outputs are grounded in verified Holy Scripture texts (KJV, NKJV, ESV, NIV, AMP).</li>
          </ul>
        </div>
      </section>

      {/* Section 5: Storage & Fresh Start */}
      <section id="privacy-storage" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            5
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Data Storage, Cloud Sync & "Start Afresh" Engine
          </h2>
        </div>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          Your spiritual entries are securely retained in local device storage and synchronized with
          our cloud database (Google Cloud / Firebase Firestore) to ensure you never lose your study
          records.
        </p>

        <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5E0D5] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#2D2D2D] text-xs">
            <Trash2 className="w-4 h-4 text-[#C5A059]" />
            <span>Instant "Delete All Mock Data" Capability</span>
          </div>
          <p className="text-xs text-[#7A7468]">
            We provide a 1-click feature on the registration screen enabling brethren to completely
            purge all sample bookmarks, demo study notes, mock dreams, and sample prayers before
            entering, ensuring your digital sanctuary begins 100% brand new, clean, and afresh.
          </p>
        </div>
      </section>

      {/* Section 6: Brethren Rights */}
      <section id="privacy-rights" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            6
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Your Rights & Pastoral Governance
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5]">
            <strong className="block text-[#2D2D2D] font-serif text-sm mb-1">Right to Access</strong>
            <p className="text-[#7A7468]">You can view, export, and review all notes, dreams, and bookmarks stored in your account at any time.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5]">
            <strong className="block text-[#2D2D2D] font-serif text-sm mb-1">Right to Rectify</strong>
            <p className="text-[#7A7468]">You may edit, update, or correct your personal profile, spiritual interests, and entries instantly.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5]">
            <strong className="block text-[#2D2D2D] font-serif text-sm mb-1">Right to Erasure</strong>
            <p className="text-[#7A7468]">You can request complete deletion of your account and associated spiritual records at any time.</p>
          </div>
        </div>
      </section>

      {/* Section 7: Contact */}
      <section id="privacy-contact" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            7
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Contacting the Ministry
          </h2>
        </div>
        <p className="text-sm text-[#4A4438]">
          If you have any questions regarding this Privacy Policy, your personal data, or pastoral
          confidentiality, please contact the ministry administration:
        </p>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E0D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2D2D2D]">Global Tower of Christ</h3>
            <p className="text-xs text-[#7A7468] mt-0.5">Apostolic Administration & Data Governance</p>
            <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[#C5A059]">
              <Mail className="w-4 h-4" />
              <span>info@globaltowerofchrist.com</span>
            </div>
          </div>

          {onBack && (
            <button
              onClick={onBack}
              type="button"
              className="px-5 py-2.5 bg-[#FAF7F0] hover:bg-[#F2EFE8] text-[#2D2D2D] border border-[#E5E0D5] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Return to Sanctuary</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#1C1B18]/70 backdrop-blur-xs animate-fadeIn"
        onClick={onBack}
      >
        <div
          className="relative w-full max-w-3xl max-h-[90vh] bg-[#F9F7F2] rounded-[32px] p-5 sm:p-8 shadow-2xl border border-[#E5E0D5] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4">
      {onBack && (
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 bg-white hover:bg-[#F2EFE8] text-[#2D2D2D] border border-[#E5E0D5] rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4 text-[#C5A059]" />
          <span>Return to Sanctuary</span>
        </button>
      )}

      {content}
    </div>
  );
};
