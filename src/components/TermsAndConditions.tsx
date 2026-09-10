import React, { useState } from "react";
import {
  FileText,
  Scale,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Printer,
  Mail,
  AlertCircle,
  BookOpen,
  Sparkles,
  HeartHandshake,
  Users,
  Compass
} from "lucide-react";

interface TermsAndConditionsProps {
  onBack?: () => void;
  isModal?: boolean;
  onAcceptAndClose?: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onBack,
  isModal = false,
  onAcceptAndClose,
}) => {
  const [activeSection, setActiveSection] = useState<string>("acceptance");

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "foundation", label: "2. Apostolic Foundation" },
    { id: "conduct", label: "3. Sacred Conduct" },
    { id: "scripture-ai", label: "4. AI & Scripture Disclaimers" },
    { id: "dreams", label: "5. Dreams & Visions" },
    { id: "ip-access", label: "6. Free Gospel & Ministry IP" },
    { id: "liability", label: "7. Limitations & Disclaimers" },
    { id: "contact", label: "8. Governance & Contact" },
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(`terms-${id}`);
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
              <Scale className="w-3.5 h-3.5" />
              <span>Sanctuary Governance & Agreement</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              Terms & Conditions (TAC)
            </h1>
            <p className="text-xs sm:text-sm text-[#7A7468]">
              Global Tower of Christ • Under the Apostolic Leadership of Apostle R.Sango
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={handlePrint}
              type="button"
              className="px-3.5 py-2 bg-white hover:bg-[#F2EFE8] text-[#2D2D2D] border border-[#E5E0D5] rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
              title="Print Terms & Conditions"
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
                <span>Accept Terms</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E5E0D5]/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8A8478]">
          <span>Last Updated: September 2026</span>
          <span>Version 2.4 • Effective for all Sanctuary Members</span>
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

      {/* Section 1: Acceptance */}
      <section id="terms-acceptance" className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            1
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Acceptance of Terms
          </h2>
        </div>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          Welcome to the <strong>Global Tower of Christ</strong> platform ("Sanctuary", "Application",
          "Service"). By accessing, creating an account, or interacting with any part of this digital
          ministry, you acknowledge that you have read, understood, and agreed to be bound by these
          Terms and Conditions ("TAC") and our companion <strong className="text-[#C5A059]">Privacy Policy</strong>.
        </p>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          If you do not agree with any provision of these Terms, you may refrain from using this
          platform. Your continued usage signifies your full covenant agreement.
        </p>
      </section>

      {/* Section 2: Apostolic Foundation */}
      <section id="terms-foundation" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            2
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Apostolic Mission & Biblical Foundation
          </h2>
        </div>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          Global Tower of Christ is a Christ-centered spiritual sanctuary and theological discipleship
          hub founded under the apostolic oversight of <strong>Apostle R.Sango</strong>. The platform is
          dedicated to the preaching of the Gospel of the Kingdom of God, the salvation of souls
          through Jesus Christ, sound biblical doctrine, and prophetic discernment.
        </p>
        <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] flex items-center gap-3">
          <Compass className="w-5 h-5 text-[#C5A059] shrink-0" />
          <p className="text-xs text-[#5D574B] italic">
            "For I delivered unto you first of all that which I also received, how that Christ died for
            our sins according to the scriptures; and that he was buried, and that he rose again the third day according to the scriptures." — 1 Corinthians 15:3-4
          </p>
        </div>
      </section>

      {/* Section 3: Sacred Conduct */}
      <section id="terms-conduct" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            3
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Member Conduct & Sacred Fellowship
          </h2>
        </div>
        <p className="text-sm text-[#4A4438]">
          As brethren partaking in fellowship, all members agree to maintain spiritual integrity and
          brotherly love. The following conduct is strictly prohibited:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
            <strong className="text-rose-700 block font-serif text-sm">Blasphemous & Abusive Content</strong>
            <p className="text-[#7A7468]">Submitting vulgar, defamatory, harassing, or blasphemous language in prayer requests or notes.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
            <strong className="text-rose-700 block font-serif text-sm">Fraud & Impersonation</strong>
            <p className="text-[#7A7468]">Impersonating church leadership, clergy, or false identities for deceptive or predatory purposes.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
            <strong className="text-rose-700 block font-serif text-sm">Commercial Solicitation</strong>
            <p className="text-[#7A7468]">Using prayer boards, encouragement feeds, or community channels for commercial spam, pyramid schemes, or sales.</p>
          </div>
          <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
            <strong className="text-rose-700 block font-serif text-sm">System Exploitation</strong>
            <p className="text-[#7A7468]">Attempting to reverse engineer, disrupt, overload, or breach the sanctuary security infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Section 4: AI & Scripture Disclaimers */}
      <section id="terms-scripture-ai" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            4
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Spiritual Insight AI & Theological Disclaimers
          </h2>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-[#E5E0D5] space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D]">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>AI as a Scripture Research Companion</span>
          </div>
          <p className="text-xs text-[#5D574B] leading-relaxed">
            The <strong>Spiritual Insight Engine</strong> is an artificial intelligence research aid
            programmed to cross-reference canonical Holy Scripture (including KJV, NKJV, ESV, NIV, and
            AMP) and biblical symbol dictionaries.
          </p>
          <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E5E0D5] text-xs text-[#6B6559] space-y-1.5">
            <p>
              <strong>Important Notice:</strong> While carefully calibrated to adhere to apostolic
              doctrine, AI outputs are computational study aids and do not constitute infallible
              prophecy, pastoral counsel, or replace the personal illumination of the Holy Spirit.
            </p>
            <p>
              Brethren are exhorted according to 1 Thessalonians 5:21: <em>"Prove all things; hold fast
              that which is good."</em>
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Dreams & Visions */}
      <section id="terms-dreams" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            5
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Dream & Vision Journal Hermeneutics
          </h2>
        </div>
        <p className="text-sm text-[#4A4438] leading-relaxed">
          Members are welcome to record personal nocturnal visions, dreams, and spiritual reflections.
          Any symbolic associations or scriptural cross-references presented by the platform are
          offered for biblical education and personal contemplation. You retain full copyright and
          ownership of your personal spiritual writings.
        </p>
      </section>

      {/* Section 6: Free Gospel & Ministry IP */}
      <section id="terms-ip-access" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            6
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            100% Free Lifetime Gospel Access & Intellectual Property
          </h2>
        </div>
        <div className="space-y-3 text-sm text-[#4A4438]">
          <p>
            In alignment with Matthew 10:8 (<em>"Freely ye have received, freely give"</em>), Global Tower of
            Christ provides full access to scriptures, study plans, prayers, and research tools with
            <strong> zero mandatory fees or subscription paywalls</strong>.
          </p>
          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D5] text-xs space-y-2">
            <strong className="text-[#2D2D2D] font-serif text-sm block">Ministry Intellectual Property:</strong>
            <p className="text-[#7A7468]">
              All sermon outlines, audio broadcasts, proprietary study curriculum, and theological
              commentaries by Apostle R.Sango and Global Tower of Christ are protected intellectual
              property. Brethren may freely quote and share excerpts for non-commercial evangelism,
              provided appropriate attribution is maintained.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Limitations & Disclaimers */}
      <section id="terms-liability" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            7
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Disclaimers & Limitation of Liability
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#5D574B] leading-relaxed">
          The service is provided on an "as is" and "as available" basis without warranties of any
          kind, either express or implied. Global Tower of Christ, Apostle R.Sango, and its ministry
          collaborators shall not be held liable for any indirect, incidental, or consequential damages
          resulting from the use or inability to use this spiritual platform or its audio narrations.
        </p>
      </section>

      {/* Section 8: Governance & Contact */}
      <section id="terms-contact" className="space-y-4 pt-6 border-t border-[#E5E0D5]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] border border-[#C5A059]/30 text-[#C5A059] flex items-center justify-center font-serif font-bold text-sm">
            8
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            Apostolic Governance & Inquiries
          </h2>
        </div>
        <p className="text-sm text-[#4A4438]">
          Global Tower of Christ reserves the right to update these terms to reflect ministry growth
          and legal compliance. For legal notices, pastoral inquiries, or questions regarding these
          terms, please reach out to:
        </p>

        <div className="p-5 bg-white rounded-2xl border border-[#E5E0D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif font-bold text-base text-[#2D2D2D]">Global Tower of Christ</h3>
            <p className="text-xs text-[#7A7468] mt-0.5">Office of Apostolic Governance</p>
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
