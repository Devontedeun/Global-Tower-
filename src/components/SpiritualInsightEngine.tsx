import React, { useState } from "react";
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Save,
  CheckCircle2,
  Share2,
  ExternalLink,
  Info,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  FileText,
  ScanLine,
  Columns,
  Compass
} from "lucide-react";
import { SpiritualInsightResult, DreamEntry, VisionEntry, BibleTranslation, HostVersionComparisonItem } from "../types";
import { Storage } from "../lib/storage";
import { verifyScriptureIntegrity } from "../lib/bibleService";
import { HOST_BIBLE_VERSIONS, buildHostVersionComparison, analyzeSpiritualInquiry } from "../lib/theologicalEngine";

interface SpiritualInsightEngineProps {
  initialQuery?: string;
  onNavigateToBible?: (book: string, chapter: number) => void;
}

export const SpiritualInsightEngine: React.FC<SpiritualInsightEngineProps> = ({
  initialQuery = "",
  onNavigateToBible,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [queryType, setQueryType] = useState<"doctrine" | "dream" | "vision" | "symbol" | "biblical_question">("doctrine");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SpiritualInsightResult | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [copiedVerseIndex, setCopiedVerseIndex] = useState<number | null>(null);
  const [selectedHostTab, setSelectedHostTab] = useState<string>("ALL");
  const [customHostScanQuery, setCustomHostScanQuery] = useState<string>("");
  const [customHostScanResult, setCustomHostScanResult] = useState<HostVersionComparisonItem | null>(null);
  const [isScanningHost, setIsScanningHost] = useState(false);

  const handleCustomHostScan = (refToScan?: string) => {
    const targetRef = refToScan || customHostScanQuery;
    if (!targetRef.trim()) return;
    setIsScanningHost(true);
    try {
      const comp = buildHostVersionComparison(targetRef.trim());
      setCustomHostScanResult(comp);
    } catch (err) {
      console.error("Host Scan Error:", err);
    } finally {
      setIsScanningHost(false);
    }
  };

  const samplePrompts = [
    {
      title: "Doctrine of Justification by Faith",
      query: "What does the Bible explicitly teach regarding justification by faith in Romans and Galatians, and how is it lived out?",
      type: "doctrine" as const
    },
    {
      title: "Biblical Guidance for Dreams",
      query: "How does Scripture teach believers to discern and interpret dreams in light of God's Word?",
      type: "dream" as const
    },
    {
      title: "Biblical Meaning of Anointing Oil",
      query: "What does anointing oil represent throughout the Old and New Testaments, and what is its redemptive significance in Christ?",
      type: "symbol" as const
    },
    {
      title: "Vision of an Open Door & Divine Calling",
      query: "During prayer, I had a persistent impression of standing before an open door. How does the Bible address open doors of opportunity and calling?",
      type: "vision" as const
    }
  ];

  const handleAnalyze = async (customQuery?: string) => {
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/spiritual-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          type: queryType,
          language: "en"
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setResult(json.data);
      } else {
        throw new Error("Failed to generate insight");
      }
    } catch (err) {
      console.warn("[Insight Engine] API unavailable or failed, utilizing canonical Bible scanner:", err);
      // Canonical fallback with verified scripture scan and structured godly points
      const fallbackResult = analyzeSpiritualInquiry(searchQuery, queryType);
      setResult(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDreamJournal = () => {
    if (!result) return;
    const newDream: DreamEntry = {
      id: `dream-${Date.now()}`,
      title: query.slice(0, 50) + (query.length > 50 ? "..." : ""),
      date: new Date().toISOString().split("T")[0],
      description: query,
      emotions: ["Reflective", "Searching"],
      symbols: result.biblicalThemes || ["Spiritual Prompt"],
      people: ["Personal"],
      isPrivate: true,
      notes: "Saved directly from Spiritual Insight Engine.",
      aiInsight: result,
      createdAt: new Date().toISOString()
    };
    Storage.saveDream(newDream);
    setSaveSuccessMsg("Successfully saved to your private Dream Journal!");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleSaveToVisionJournal = () => {
    if (!result) return;
    const newVision: VisionEntry = {
      id: `vision-${Date.now()}`,
      title: query.slice(0, 50) + (query.length > 50 ? "..." : ""),
      date: new Date().toISOString().split("T")[0],
      description: query,
      context: "Recorded from Spiritual Insight Engine analysis.",
      scriptures: result.relevantScriptures?.map((s) => s.reference) || [],
      personalReflections: result.summary,
      isPrivate: true,
      aiInsight: result,
      followUpNotes: "Follow-up in prayer with pastoral counsel.",
      createdAt: new Date().toISOString()
    };
    Storage.saveVision(newVision);
    setSaveSuccessMsg("Successfully saved to your private Vision Journal!");
    setTimeout(() => setSaveSuccessMsg(""), 4000);
  };

  const handleShare = () => {
    if (!result) return;
    const textToCopy = `Global Tower of Christ - Spiritual Insight\n\nQuery: "${query}"\n\nBiblical Themes: ${result.biblicalThemes.join(
      ", "
    )}\n\nRelevant Scripture: ${result.relevantScriptures[0]?.reference} - "${
      result.relevantScriptures[0]?.text
    }"\n\nDisclaimer: ${result.disclaimer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  const handleCopySingleScripture = (text: string, ref: string, index: number) => {
    navigator.clipboard.writeText(`"${text}" — ${ref}`);
    setCopiedVerseIndex(index);
    setTimeout(() => setCopiedVerseIndex(null), 2500);
  };

  return (
    <div id="spiritual-insight-container" className="w-full space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F9F7F2] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Biblical Discernment & Scripture Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D] leading-tight">
            Spiritual Insight & Scripture Analysis
          </h1>

          <p className="mt-2 text-sm text-[#7A7468] leading-relaxed">
            Submit spiritual impressions, dreams, visions, or biblical questions for Bible-centered analysis. Every passage is verified against authentic canonical Scripture.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#8A8478] font-medium">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Strict Canonical Verification</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F9F7F2] px-2.5 py-1 rounded-full border border-[#E5E0D5]">
              <HelpCircle className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Tested Against Scripture (1 Thess 5:21)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Input Console */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 shadow-xs space-y-5">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
          {[
            { id: "doctrine", label: "Biblical Doctrine & Context" },
            { id: "dream", label: "Dreams" },
            { id: "vision", label: "Visions & Prophecy" },
            { id: "symbol", label: "Biblical Symbols" },
            { id: "biblical_question", label: "Scripture Inquiry" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setQueryType(tab.id as any)}
              className={`px-4 py-2.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                queryType === tab.id
                  ? "bg-[#C5A059] text-white shadow-xs font-bold"
                  : "bg-[#F9F7F2] text-[#7A7468] hover:bg-[#FDFCF9] hover:text-[#C5A059] border border-[#E5E0D5]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative space-y-3">
          <textarea
            id="spiritual-insight-input"
            rows={4}
            placeholder={
              queryType === "doctrine"
                ? "Enter any biblical doctrine, theological question, or passage context (e.g. 'What does Scripture teach on justification and sanctification?')..."
                : queryType === "dream"
                ? "Describe your dream, night worry, or concern in detail (e.g. 'I dreamed I was standing beside a river in bright sunlight...')"
                : queryType === "vision"
                ? "Describe the vision, prophecy, or impression you received during prayer or worship..."
                : queryType === "symbol"
                ? "Enter a biblical symbol or motif (e.g. 'Oil', 'Eagle', 'Crown', 'Lampstand')..."
                : "Ask any biblical question, doctrine inquiry, or passage clarification..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-4 rounded-2xl bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white text-[#2D2D2D] text-sm font-medium placeholder-[#AAA498] focus:outline-none resize-none transition-all"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#8A8478]">
              <Info className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Real Bible references guaranteed • Canonical theological verification</span>
            </div>

            <button
              id="analyze-btn"
              onClick={() => handleAnalyze()}
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-md shadow-[#C5A059]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching Scripture...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze with Scripture</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div className="pt-3 border-t border-[#E5E0D5]">
          <div className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider mb-2">Explore Sample Inquiries:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {samplePrompts.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setQuery(sample.query);
                  setQueryType(sample.type);
                  handleAnalyze(sample.query);
                }}
                className="p-3 rounded-2xl bg-[#FDFCF9] hover:bg-[#F9F7F2] border border-[#E5E0D5] hover:border-[#C5A059] cursor-pointer text-xs transition-all group"
              >
                <div className="font-bold text-[#2D2D2D] group-hover:text-[#C5A059] flex items-center justify-between">
                  <span>{sample.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8A8478] group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[#8A8478] line-clamp-1 mt-0.5 font-sans">{sample.query}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="flex items-center gap-2.5 p-4 bg-[#FDFCF9] border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-semibold animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Results View with Strict Separation of Categories */}
      {result && (
        <div id="spiritual-insight-results" className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#E5E0D5]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#C5A059]">Scriptural Analysis & Reflection</div>
              <h2 className="text-xl font-serif font-bold text-[#2D2D2D] mt-0.5">Spiritual Insight Breakdown</h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToDreamJournal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#C5A059] text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Save this analysis into your private Dream Journal"
              >
                <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Save Dream</span>
              </button>
              <button
                onClick={handleSaveToVisionJournal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDFCF9] hover:bg-white border border-[#E5E0D5] text-[#7A7468] hover:text-[#C5A059] text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Save this analysis into your private Vision Journal"
              >
                <Save className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Save Vision</span>
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F9F7F2] hover:bg-[#E5E0D5] text-[#2D2D2D] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedNotification ? "Copied!" : "Share"}</span>
              </button>
            </div>
          </div>

          {/* Pastoral Comfort Banner for Disturbing Dreams */}
          {(result.isDisturbingDream || result.pastoralComfortMessage) && (
            <div className="p-5 bg-[#FDFCF9] border-2 border-[#C5A059]/40 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Pastoral Care & Comfort Guidance</span>
              </div>
              <p className="text-xs text-[#2D2D2D] leading-relaxed font-sans">
                {result.pastoralComfortMessage ||
                  "Dreams involving death, fear, or conflict can feel unsettling. In biblical pastoral discernment, dreams are not automatic prophecies of physical harm. Scripture anchors believers in God's peace: 'For God gave us a spirit not of fear but of power and love and self-control' (2 Timothy 1:7), and nothing can separate us from Christ's love (Romans 8:38-39)."}
              </p>
            </div>
          )}

          {/* 🕊️ Godly Structured Biblical Points (Canonical Bible Scan) */}
          {result.scannedBiblicalPoints && result.scannedBiblicalPoints.length > 0 && (
            <div className="p-6 bg-gradient-to-b from-[#FDFCF9] to-white border-2 border-[#C5A059]/30 rounded-3xl space-y-5 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D5] pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#C5A059]/15 flex items-center justify-center text-[#C5A059]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">
                      Biblical Scan: Structured Godly Points
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A7468] mt-1 font-sans">
                    Scanned across the 66-book biblical canon and arranged into neat, godly doctrinal principles and practical faith applications.
                  </p>
                </div>
                {result.scannerNotice && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F9F7F2] text-[#8A8478] border border-[#E5E0D5] rounded-full text-[11px] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                    Canonical Scanner Active
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.scannedBiblicalPoints.map((pt) => (
                  <div
                    key={pt.pointNumber}
                    className="p-5 bg-[#FDFCF9] border border-[#E5E0D5] hover:border-[#C5A059]/60 rounded-2xl transition-all space-y-3.5 shadow-2xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xs font-bold font-serif shadow-xs">
                          {pt.pointNumber}
                        </span>
                        <h4 className="font-serif font-bold text-[#2D2D2D] text-base">
                          {pt.title.replace(/^\d+\.\s*/, "")}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-white border border-[#E5E0D5] text-[#8A8478] rounded-md text-[11px] font-medium">
                          {pt.testament}
                        </span>
                        <span className="px-2.5 py-0.5 bg-[#C5A059]/10 text-[#C5A059] font-bold rounded-md text-[11px]">
                          {pt.covenantTheme}
                        </span>
                      </div>
                    </div>

                    {/* Scripture Citation & Verbatim Text */}
                    <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] border-l-4 border-l-[#C5A059] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-xs text-[#C5A059] flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
                          {pt.scriptureRef}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`"${pt.scriptureText}" — ${pt.scriptureRef}`);
                          }}
                          className="text-[11px] text-[#8A8478] hover:text-[#C5A059] flex items-center gap-1 cursor-pointer transition-colors"
                          title="Copy Scripture"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <p className="text-xs text-[#2D2D2D] italic font-serif leading-relaxed">
                        "{pt.scriptureText}"
                      </p>
                    </div>

                    {/* Theological Principle */}
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-[#2D2D2D] uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-[#8A8478]">
                        <Sparkles className="w-3 h-3 text-[#C5A059]" />
                        Godly Theological Principle
                      </span>
                      <p className="text-[#2D2D2D] leading-relaxed font-sans pl-1">
                        {pt.theologicalPrinciple}
                      </p>
                    </div>

                    {/* Practical & Godly Application */}
                    <div className="space-y-1 text-xs pt-2 border-t border-[#E5E0D5]/70">
                      <span className="font-bold text-[#2D2D2D] uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-emerald-800">
                        <Compass className="w-3 h-3 text-emerald-600" />
                        Practical Faith & Prayer Application
                      </span>
                      <p className="text-[#4E483E] leading-relaxed font-sans pl-1">
                        {pt.practicalApplication}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Dream Events & Symbols */}
          {result.extractedEventsAndSymbols && (
            <div className="p-5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold text-[#2D2D2D] uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>1. Extracted Events & Dream Elements</span>
                </div>
                <span className="text-[10px] text-[#8A8478] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                  Relevance Pipeline Step 1
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {result.extractedEventsAndSymbols.events && result.extractedEventsAndSymbols.events.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                    <span className="font-bold text-[#C5A059] text-[10px] uppercase block">Core Events Identified</span>
                    <ul className="space-y-1 text-[#7A7468]">
                      {result.extractedEventsAndSymbols.events.map((evt, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#C5A059] font-bold">•</span>
                          <span>{evt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.extractedEventsAndSymbols.symbols && result.extractedEventsAndSymbols.symbols.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                    <span className="font-bold text-[#C5A059] text-[10px] uppercase block">Identified Biblical Symbols & Motifs</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {result.extractedEventsAndSymbols.symbols.map((sym, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 bg-[#FDFCF9] text-[#2D2D2D] border border-[#E5E0D5] rounded-lg text-[11px] font-medium">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Thematic Explorations */}
          {result.thematicExplorations && result.thematicExplorations.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-[#2D2D2D] uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>2. Biblical Thematic Explorations</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {result.thematicExplorations.map((thm, idx) => (
                  <div key={idx} className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#2D2D2D] text-sm font-serif">{thm.themeName}</h4>
                      {thm.crossReferences && thm.crossReferences.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {thm.crossReferences.map((ref, rIdx) => (
                            <span key={rIdx} className="text-[10px] bg-white border border-[#E5E0D5] text-[#C5A059] px-2 py-0.5 rounded">
                              {ref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[#7A7468] leading-relaxed">{thm.biblicalTeaching}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Themes Badges */}
          {result.biblicalThemes && result.biblicalThemes.length > 0 && !result.extractedEventsAndSymbols && (
            <div>
              <div className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider mb-2">Possible Biblical Themes</div>
              <div className="flex flex-wrap gap-2">
                {result.biblicalThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] rounded-full text-xs font-semibold"
                  >
                    #{theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. CATEGORY: DIRECT RELEVANT SCRIPTURES (RANKED BY ACTUAL RELEVANCE) */}
          {result.relevantScriptures && result.relevantScriptures.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#C5A059]" />
                  <span>3. Directly Relevant Scripture Passages (Ranked by Relevance)</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Direct Biblical Connection
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {result.relevantScriptures.map((sc, i) => {
                  const parts = sc.reference.split(" ");
                  const book = parts[0];
                  const chapter = parseInt(parts[1]?.split(":")[0] || "1");

                  return (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white border border-[#E5E0D5] hover:border-[#C5A059] shadow-2xs transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-[#2D2D2D] font-serif">{sc.reference}</span>
                          <span className="text-[10px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2 py-0.5 rounded border border-[#E5E0D5]">
                            {sc.translation || "ESV"}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Relevance: {sc.relevanceScore ? `${sc.relevanceScore}/5` : "5/5"} • {sc.relevanceScore === 5 ? "Direct Theme" : "Strong Theme"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopySingleScripture(sc.text, sc.reference, i)}
                            className="p-1.5 text-[#7A7468] hover:text-[#C5A059] bg-[#F9F7F2] rounded-lg border border-[#E5E0D5] cursor-pointer"
                            title="Copy scripture"
                          >
                            {copiedVerseIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          {onNavigateToBible && (
                            <button
                              onClick={() => onNavigateToBible(book, chapter)}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A059] hover:underline cursor-pointer"
                            >
                              <span>Read in Bible Hub</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <blockquote className="text-base text-[#2D2D2D] italic border-l-2 border-[#C5A059] pl-3.5 py-0.5 font-serif leading-relaxed">
                        "{sc.text}"
                      </blockquote>

                      <div className="p-3 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5] text-xs space-y-1.5">
                        {sc.whyRelevant && (
                          <p className="text-[#2D2D2D]">
                            <span className="font-semibold text-[#C5A059]">Why Relevant: </span>
                            {sc.whyRelevant}
                          </p>
                        )}
                        <p className="text-[#7A7468]">
                          <span className="font-semibold text-[#2D2D2D]">Biblical Context: </span>
                          {sc.context}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#8A8478] pt-1 border-t border-[#E5E0D5]/60">
                          <span>Source: {sc.source || "Canonical Scripture Archive"}</span>
                          <span>License: {sc.license || "Authorized Educational Quotation"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HOST VERSION MULTI-BIBLE SCANNER (SCAN ALL BIBLE TYPES) */}
          {result.hostVersionComparison && result.hostVersionComparison.length > 0 && (
            <div className="p-5 bg-gradient-to-br from-[#FAF8F5] to-[#F5F0E6] border-2 border-[#C5A059]/40 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D5] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#C5A059] text-white flex items-center justify-center shadow-xs">
                    <ScanLine className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2D2D2D] font-serif flex items-center gap-2">
                      <span>Host Version Comparison: Scan All Bible Types</span>
                      <span className="text-[10px] font-sans font-bold bg-[#C5A059] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Apostolic Edition
                      </span>
                    </h3>
                    <p className="text-[11px] text-[#7A7468]">
                      Compare key scriptures across 6 major canonical translations (ESV, KJV, NIV, NKJV, NLT, WEB) side-by-side.
                    </p>
                  </div>
                </div>

                {/* Translation Selector Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E0D5]">
                  <button
                    onClick={() => setSelectedHostTab("ALL")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      selectedHostTab === "ALL"
                        ? "bg-[#2D2D2D] text-white shadow-xs"
                        : "text-[#7A7468] hover:text-[#2D2D2D]"
                    }`}
                  >
                    All Types (Grid)
                  </button>
                  {HOST_BIBLE_VERSIONS.map((v) => (
                    <button
                      key={v.code}
                      onClick={() => setSelectedHostTab(v.code)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        selectedHostTab === v.code
                          ? "bg-[#C5A059] text-white shadow-xs"
                          : "text-[#7A7468] hover:text-[#C5A059]"
                      }`}
                      title={`${v.name} (${v.style})`}
                    >
                      {v.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Host Comparison Entries */}
              <div className="space-y-4">
                {result.hostVersionComparison.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-serif text-[#2D2D2D]">{item.reference}</span>
                        <span className="text-[10px] text-[#C5A059] bg-[#FDFCF9] px-2 py-0.5 rounded border border-[#E5E0D5] font-semibold">
                          {item.translations.length} Translations Scanned
                        </span>
                      </div>

                      {onNavigateToBible && (
                        <button
                          onClick={() => onNavigateToBible(item.book, item.chapter)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C5A059] hover:underline cursor-pointer"
                        >
                          <span>Open in Bible Hub</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {selectedHostTab === "ALL" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {item.translations.map((t, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E0D5] space-y-1.5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-[#C5A059] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                                  {t.translation}
                                </span>
                                <span className="text-[9px] text-[#8A8478] font-medium">{t.note}</span>
                              </div>
                              <p className="text-xs text-[#2D2D2D] italic font-serif mt-2 leading-relaxed">
                                "{t.text}"
                              </p>
                            </div>
                            <span className="text-[10px] text-[#8A8478] pt-1 border-t border-[#E5E0D5]/50 block">
                              {t.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/40 space-y-2">
                        {(() => {
                          const activeTrans = item.translations.find((t) => t.translation === selectedHostTab) || item.translations[0];
                          return (
                            <>
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white bg-[#C5A059] px-2.5 py-0.5 rounded-lg">
                                  {activeTrans?.translation} • {activeTrans?.name}
                                </span>
                                <span className="text-[10px] text-[#8A8478] font-medium">{activeTrans?.note}</span>
                              </div>
                              <blockquote className="text-sm text-[#2D2D2D] italic font-serif leading-relaxed pl-2 border-l-2 border-[#C5A059]">
                                "{activeTrans?.text}"
                              </blockquote>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Host Quick Scanner Search Bar */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E5E0D5] space-y-2">
                <span className="text-[11px] font-bold text-[#2D2D2D] uppercase tracking-wider block">
                  Scan Any Scripture Reference Across All Bible Types
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customHostScanQuery}
                    onChange={(e) => setCustomHostScanQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomHostScan()}
                    placeholder="e.g. Isaiah 40:31, Psalm 23:1, John 11:25, Luke 10:19"
                    className="flex-1 px-3 py-2 bg-[#FDFCF9] border border-[#E5E0D5] rounded-xl text-xs text-[#2D2D2D] focus:outline-none focus:border-[#C5A059]"
                  />
                  <button
                    onClick={() => handleCustomHostScan()}
                    disabled={isScanningHost || !customHostScanQuery.trim()}
                    className="px-4 py-2 bg-[#C5A059] hover:bg-[#B38F48] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isScanningHost ? "Scanning..." : "Scan All Types"}
                  </button>
                </div>

                {customHostScanResult && (
                  <div className="mt-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#C5A059]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-serif text-[#2D2D2D]">
                        Scanned: {customHostScanResult.reference}
                      </span>
                      <span className="text-[10px] text-[#C5A059] font-bold bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                        All 6 Host Translations
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                      {customHostScanResult.translations.map((t, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded-lg border border-[#E5E0D5] text-[11px] space-y-1">
                          <div className="font-bold text-[#C5A059] flex justify-between">
                            <span>{t.translation}</span>
                            <span className="text-[9px] text-[#8A8478] font-normal">{t.note}</span>
                          </div>
                          <p className="italic text-[#2D2D2D] line-clamp-3 font-serif">"{t.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Secondary / Other Relevant Scriptures */}
          {result.otherRelevantScriptures && result.otherRelevantScriptures.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#7A7468] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#8A8478]" />
                <span>Other Related Scripture Passages</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.otherRelevantScriptures.map((sc, i) => (
                  <div key={i} className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2D2D2D] font-serif">{sc.reference}</span>
                      <span className="text-[10px] text-[#8A8478] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                        Score: {sc.relevanceScore || 3}/5
                      </span>
                    </div>
                    <p className="italic text-[#7A7468] line-clamp-3">"{sc.text}"</p>
                    {sc.whyRelevant && <p className="text-[11px] text-[#2D2D2D]"><span className="font-semibold text-[#C5A059]">Relation: </span>{sc.whyRelevant}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dedicated Section: General Discernment Scriptures (Separated from Direct Dream Interpretation) */}
          {result.generalDiscernmentScriptures && result.generalDiscernmentScriptures.length > 0 && (
            <div className="p-5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>General Biblical Discernment Principles</span>
                </div>
                <span className="text-[10px] text-[#8A8478] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                  Wisdom for Testing Impressions
                </span>
              </div>
              <p className="text-xs text-[#7A7468] leading-relaxed">
                The following scriptures provide universal apostolic principles for prayerfully testing spiritual impressions, dreams, and life decisions against God's Word, rather than interpreting specific symbols:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {result.generalDiscernmentScriptures.map((sc, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-[#E5E0D5] space-y-1 text-xs">
                    <div className="font-bold text-[#2D2D2D] font-serif">{sc.reference}</div>
                    <p className="italic text-[#7A7468] text-[11px] leading-tight">"{sc.text}"</p>
                    <p className="text-[10px] text-[#8A8478] pt-1">{sc.whyRelevant}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. CATEGORY: AI EXPLANATION & BIBLICAL CONTEXT */}
          <div className="p-5 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>4. Biblical Context & Synthetic Overview</span>
              </div>
              <span className="text-[10px] text-[#8A8478] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                Historical & Linguistic Context
              </span>
            </div>

            <p className="text-[#2D2D2D] text-sm leading-relaxed">{result.summary}</p>

            {result.biblicalContextExplanation && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#E5E0D5]/70 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
                  <span className="font-bold text-[#C5A059] text-[10px] uppercase block">Historical Setting</span>
                  <p className="text-[#7A7468] text-[11px] leading-tight">{result.biblicalContextExplanation.historicalSetting}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
                  <span className="font-bold text-[#C5A059] text-[10px] uppercase block">Original Audience</span>
                  <p className="text-[#7A7468] text-[11px] leading-tight">{result.biblicalContextExplanation.originalAudience}</p>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#E5E0D5] space-y-1">
                  <span className="font-bold text-[#C5A059] text-[10px] uppercase block">Theological Core</span>
                  <p className="text-[#7A7468] text-[11px] leading-tight">{result.biblicalContextExplanation.theologicalTheme}</p>
                </div>
              </div>
            )}
          </div>

          {/* 4 BIBLICAL DISCERNMENT PILLARS & WIDER SCRIPTURAL CONTEXT */}

          {/* PILLAR 1: WHAT THE BIBLE EXPLICITLY SAYS */}
          {result.explicitScriptureTeaching && result.explicitScriptureTeaching.length > 0 && (
            <div className="p-5 bg-gradient-to-br from-[#FDFCF9] to-[#FAF8F5] border-2 border-emerald-600/30 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Pillar 1: What the Bible Explicitly Says (Primary Biblical Foundation)</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  Direct Scripture Teaching
                </span>
              </div>
              <ul className="space-y-2">
                {result.explicitScriptureTeaching.map((statement, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#2D2D2D] leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                      ✓
                    </span>
                    <span className="pt-0.5 font-medium">{statement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PILLAR 2: SUPPORTING SCRIPTURE PASSAGES (WIDER CANONICAL CONTEXT) */}
          {result.supportingScriptures && result.supportingScriptures.length > 0 && (
            <div className="p-5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Pillar 2: Relevant Supporting Scripture (Wider Biblical Context)</span>
                </div>
                <span className="text-[10px] text-[#7A7468] bg-white px-2.5 py-0.5 rounded-full border border-[#E5E0D5]">
                  Cross-Canonical Passages
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.supportingScriptures.map((sc, idx) => (
                  <div key={idx} className="p-3.5 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2D2D2D] font-serif">{sc.reference}</span>
                      <span className="text-[10px] text-[#C5A059] font-bold bg-[#FDFCF9] px-2 py-0.5 rounded border border-[#E5E0D5]">
                        {sc.translation || "ESV"}
                      </span>
                    </div>
                    <blockquote className="italic text-[#7A7468] line-clamp-3 pl-2 border-l border-[#C5A059]">
                      "{sc.text}"
                    </blockquote>
                    {sc.whyRelevant && (
                      <p className="text-[11px] text-[#2D2D2D] pt-1">
                        <span className="font-semibold text-[#C5A059]">Context: </span>
                        {sc.whyRelevant}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PILLAR 3: INTERPRETATIONS & PERSPECTIVES FROM OTHER PEOPLE */}
          {result.humanInterpretations && result.humanInterpretations.length > 0 && (
            <div className="p-5 bg-[#FAF8F5] border border-amber-300/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider">
                  <Layers className="w-4 h-4 text-amber-700" />
                  <span>Pillar 3: Human Interpretations & Perspectives (Compared Against Scripture)</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Human Perspectives • Not Biblical Fact
                </span>
              </div>
              <p className="text-xs text-[#7A7468] leading-relaxed">
                The perspectives below reflect historical commentators, theological traditions, and human interpretations. While informative, they must be compared with the Bible and never elevated to the level of biblical fact.
              </p>
              <div className="space-y-3">
                {result.humanInterpretations.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#2D2D2D]">{item.proponentOrTradition || "Commentary Tradition"}</span>
                      <span className="text-[10px] text-[#8A8478] bg-[#F9F7F2] px-2 py-0.5 rounded">Human Perspective</span>
                    </div>
                    <p className="text-[#7A7468] leading-relaxed">{item.perspective}</p>
                    <div className="p-2.5 bg-[#FAF8F5] rounded-lg border-l-2 border-amber-600 text-[11px] space-y-1">
                      <span className="font-bold text-amber-900 block">Biblical Comparison:</span>
                      <p className="text-[#2D2D2D] leading-relaxed">{item.biblicalComparison}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PILLAR 4: WHAT IS UNCERTAIN OR SPECULATIVE */}
          {result.uncertainOrSpeculative && result.uncertainOrSpeculative.length > 0 && (
            <div className="p-5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-[#8A8478]" />
                  <span>Pillar 4: What is Uncertain or Speculative (Biblical Boundaries)</span>
                </div>
                <span className="text-[10px] text-[#8A8478] bg-white px-2 py-0.5 rounded border border-[#E5E0D5]">
                  Where Scripture is Silent
                </span>
              </div>
              <p className="text-xs text-[#7A7468] leading-relaxed">
                Sound biblical scholarship recognizes boundaries where the text does not give dogmatic or predictive certainty:
              </p>
              <ul className="space-y-2">
                {result.uncertainOrSpeculative.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#7A7468] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0 mt-1.5"></span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* PRACTICAL GUIDANCE BASED ON SCRIPTURAL INFORMATION */}
          {result.practicalGuidance && (
            <div className="p-5 bg-gradient-to-br from-[#FAF8F5] to-white border-2 border-[#C5A059]/40 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#2D2D2D] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Practical Guidance & Pastoral Next Steps</span>
                </div>
                <span className="text-[10px] font-bold text-[#C5A059] bg-[#FDFCF9] px-2.5 py-0.5 rounded-full border border-[#E5E0D5]">
                  Action & Reflection
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                {/* Prayer Prompt */}
                <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                  <span className="font-bold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                    1. Prayer of Surrender & Wisdom
                  </span>
                  <p className="text-[#2D2D2D] italic font-serif leading-relaxed text-sm">
                    "{result.practicalGuidance.prayerPrompt}"
                  </p>
                </div>

                {/* Personal Reflection */}
                <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                  <span className="font-bold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                    2. Personal Reflection Question
                  </span>
                  <p className="text-[#2D2D2D] leading-relaxed">
                    {result.practicalGuidance.reflectionQuestion}
                  </p>
                </div>

                {/* Seeking Wise Guidance */}
                <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                  <span className="font-bold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                    3. Seeking Wise Counsel
                  </span>
                  <p className="text-[#7A7468] leading-relaxed">
                    {result.practicalGuidance.wiseCounselConsideration}
                  </p>
                </div>

                {/* Practical Action Step */}
                <div className="p-4 bg-white rounded-xl border border-[#E5E0D5] space-y-1.5">
                  <span className="font-bold text-[#C5A059] uppercase text-[10px] tracking-wider block">
                    4. Tangible Spiritual Step
                  </span>
                  <p className="text-[#7A7468] leading-relaxed">
                    {result.practicalGuidance.actionStep}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Disclaimer & Safety Standard */}
          <div className="p-4 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] text-[11px] text-[#7A7468] leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#C5A059]">Theological Safety & Accuracy Standard: </span>
              {result.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
