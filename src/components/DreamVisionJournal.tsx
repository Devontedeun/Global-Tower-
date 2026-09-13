import React, { useState, useEffect } from "react";
import {
  Moon,
  Sun,
  Lock,
  Globe,
  Sparkles,
  Plus,
  Trash2,
  Calendar,
  Tag,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Search,
  CheckCircle2,
  Compass,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
  AlertCircle
} from "lucide-react";
import { DreamEntry, VisionEntry, SpiritualInsightResult } from "../types";
import { Storage } from "../lib/storage";
import { BIBLICAL_SYMBOLS, BiblicalSymbol } from "../data/biblicalSymbolsData";
import { analyzeSpiritualInquiry } from "../lib/theologicalEngine";

interface DreamVisionJournalProps {
  onAnalyzeWithAI?: (text: string) => void;
  onNavigateToBible?: (book: string, chapter: number) => void;
}

export const DreamVisionJournal: React.FC<DreamVisionJournalProps> = ({
  onAnalyzeWithAI,
  onNavigateToBible,
}) => {
  const [activeTab, setActiveTab] = useState<"interpret-ai" | "dreams" | "visions" | "symbols" | "doctrine">("interpret-ai");
  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [visions, setVisions] = useState<VisionEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Symbols tab state
  const [selectedSymbolCategory, setSelectedSymbolCategory] = useState<string>("ALL");
  const [symbolSearch, setSymbolSearch] = useState("");

  // Doctrine & Inquiry tab state
  const [inquiryQuery, setInquiryQuery] = useState("");
  const [inquiryType, setInquiryType] = useState<"doctrine" | "dream" | "vision" | "symbol" | "biblical_question">("doctrine");
  const [inquiryResult, setInquiryResult] = useState<SpiritualInsightResult | null>(null);
  const [isInquiring, setIsInquiring] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [emotions, setEmotions] = useState("Peaceful, Reverent");
  const [symbols, setSymbols] = useState("River, Light");
  const [people, setPeople] = useState("Myself");
  const [context, setContext] = useState("");
  const [scriptures, setScriptures] = useState("John 7:38");
  const [notes, setNotes] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);

  useEffect(() => {
    setDreams(Storage.getDreams());
    setVisions(Storage.getVisions());
  }, []);

  const handleCreateEntry = () => {
    if (!title.trim() || !description.trim()) return;

    if (activeTab === "dreams") {
      const newDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        title,
        date,
        description,
        emotions: emotions.split(",").map((s) => s.trim()).filter(Boolean),
        symbols: symbols.split(",").map((s) => s.trim()).filter(Boolean),
        people: people.split(",").map((s) => s.trim()).filter(Boolean),
        isPrivate,
        notes,
        createdAt: new Date().toISOString()
      };
      const updated = Storage.saveDream(newDream);
      setDreams(updated);
    } else if (activeTab === "visions") {
      const newVision: VisionEntry = {
        id: `vision-${Date.now()}`,
        title,
        date,
        description,
        context,
        scriptures: scriptures.split(",").map((s) => s.trim()).filter(Boolean),
        personalReflections: notes,
        isPrivate,
        followUpNotes: "",
        createdAt: new Date().toISOString()
      };
      const updated = Storage.saveVision(newVision);
      setVisions(updated);
    }

    // Reset Form
    setTitle("");
    setDescription("");
    setNotes("");
    setIsCreating(false);
  };

  const handleDelete = (id: string, type: "dream" | "vision") => {
    if (type === "dream") {
      const updated = Storage.deleteDream(id);
      setDreams(updated);
    } else {
      const updated = Storage.deleteVision(id);
      setVisions(updated);
    }
  };

  const handleRequestAIAnalysis = async (entry: DreamEntry | VisionEntry, type: "dream" | "vision") => {
    setAnalyzingId(entry.id);
    try {
      const response = await fetch("/api/spiritual-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `${entry.title}: ${entry.description}`,
          type: type === "dream" ? "dream" : "vision",
          language: "en"
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        if (type === "dream") {
          const updatedDream: DreamEntry = { ...(entry as DreamEntry), aiInsight: json.data };
          const updatedList = Storage.saveDream(updatedDream);
          setDreams(updatedList);
        } else {
          const updatedVision: VisionEntry = { ...(entry as VisionEntry), aiInsight: json.data };
          const updatedList = Storage.saveVision(updatedVision);
          setVisions(updatedList);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingId(null);
      setExpandedId(entry.id);
    }
  };

  const handleRunInquiry = async (customQuery?: string, customType?: "doctrine" | "dream" | "vision" | "symbol" | "biblical_question") => {
    const q = (customQuery || inquiryQuery).trim();
    const t = customType || inquiryType;
    if (!q) return;

    if (customQuery) {
      setInquiryQuery(customQuery);
    }
    if (customType) {
      setInquiryType(customType);
    }

    setIsInquiring(true);
    try {
      const res = await fetch("/api/spiritual-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          type: t,
          language: "en"
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setInquiryResult(data.data);
      }
    } catch (e) {
      console.error("Inquiry error:", e);
    } finally {
      setIsInquiring(false);
    }
  };

  const handleInquireFromSymbol = (symbol: BiblicalSymbol) => {
    const prompt = `What is the full scriptural significance and biblical doctrine of ${symbol.symbol} across Old and New Testament covenants?`;
    setActiveTab("doctrine");
    setInquiryQuery(prompt);
    setInquiryType("symbol");
    handleRunInquiry(prompt, "symbol");
  };

  // Dedicated AI Interpreter Tab State
  const [aiInterpretText, setAiInterpretText] = useState("");
  const [aiInterpretType, setAiInterpretType] = useState<"dream" | "vision" | "symbol" | "spiritual_impression">("dream");
  const [aiInterpretResult, setAiInterpretResult] = useState<SpiritualInsightResult | null>(null);
  const [isAiInterpreting, setIsAiInterpreting] = useState(false);

  const handleRunAiInterpretation = async (customPrompt?: string, customType?: "dream" | "vision" | "symbol" | "spiritual_impression") => {
    const text = (customPrompt || aiInterpretText).trim();
    const t = customType || aiInterpretType;
    if (!text) return;

    if (customPrompt) setAiInterpretText(customPrompt);
    if (customType) setAiInterpretType(customType);

    setIsAiInterpreting(true);
    setSaveSuccessMsg(null);
    try {
      const res = await fetch("/api/spiritual-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          type: t,
          language: "en"
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiInterpretResult(data.data);
      } else {
        const fallback = analyzeSpiritualInquiry(text, t);
        setAiInterpretResult(fallback);
      }
    } catch (e) {
      console.warn("AI Interpretation API unavailable, scanning Bible fallback:", e);
      const fallback = analyzeSpiritualInquiry(text, t);
      setAiInterpretResult(fallback);
    } finally {
      setIsAiInterpreting(false);
    }
  };

  const handleSaveAiResultToJournal = (targetType: "dream" | "vision") => {
    if (!aiInterpretText.trim() || !aiInterpretResult) return;

    const autoTitle = aiInterpretResult.biblicalThemes?.[0] || (targetType === "dream" ? "Prophetic Dream Reflection" : "Spiritual Vision Reflection");
    const extractedSymbols = aiInterpretResult.extractedEventsAndSymbols?.symbols || [];
    const extractedEmotions = aiInterpretResult.extractedEventsAndSymbols?.emotions || ["Reverent"];
    const scriptureRefs = aiInterpretResult.supportingScriptures?.map((s) => s.reference).join(", ") || "1 Thessalonians 5:21";

    if (targetType === "dream") {
      const newDream: DreamEntry = {
        id: `dream-${Date.now()}`,
        title: autoTitle,
        date: new Date().toISOString().split("T")[0],
        description: aiInterpretText,
        emotions: extractedEmotions,
        symbols: extractedSymbols,
        people: ["Myself"],
        isPrivate: true,
        notes: `AI Scriptural Exegesis: ${aiInterpretResult.summary}`,
        aiInsight: aiInterpretResult,
        createdAt: new Date().toISOString()
      };
      const updated = Storage.saveDream(newDream);
      setDreams(updated);
      setSaveSuccessMsg("Successfully saved to your private Dream Journal!");
    } else {
      const newVision: VisionEntry = {
        id: `vision-${Date.now()}`,
        title: autoTitle,
        date: new Date().toISOString().split("T")[0],
        description: aiInterpretText,
        context: "Night season & prayer reflection",
        personalReflections: aiInterpretResult.summary,
        scriptures: scriptureRefs.split(",").map((s) => s.trim()),
        isPrivate: true,
        followUpNotes: "Grounded in Biblical Doctrine",
        aiInsight: aiInterpretResult,
        createdAt: new Date().toISOString()
      };
      const updated = Storage.saveVision(newVision);
      setVisions(updated);
      setSaveSuccessMsg("Successfully saved to your private Vision Journal!");
    }

    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const filteredDreams = dreams.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.symbols.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVisions = visions.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSymbols = BIBLICAL_SYMBOLS.filter((sym) => {
    const matchesCategory = selectedSymbolCategory === "ALL" || sym.category === selectedSymbolCategory;
    const matchesSearch =
      sym.symbol.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      sym.primaryMeaning.toLowerCase().includes(symbolSearch.toLowerCase()) ||
      sym.propheticSignificance.toLowerCase().includes(symbolSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sampleInquiries = [
    {
      label: "Doctrine of Justification",
      type: "doctrine" as const,
      query: "What is the apostolic doctrine of justification by faith alone in Romans 5:1-5?"
    },
    {
      label: "Water & Rivers Dream",
      type: "dream" as const,
      query: "What is the biblical interpretation of seeing clear flowing rivers and drinking clean water in a dream?"
    },
    {
      label: "Anointing Oil Symbol",
      type: "symbol" as const,
      query: "Explain the scriptural meaning and authority of anointing oil in James 5:14 and 1 Samuel 16."
    },
    {
      label: "Discerning Prophetic Impressions",
      type: "vision" as const,
      query: "How does a believer biblically test and judge impressions and spiritual visions according to 1 Thessalonians 5:21?"
    },
    {
      label: "Lion of Judah Authority",
      type: "biblical_question" as const,
      query: "What is the covenant significance of Christ as the Lion of the Tribe of Judah in Revelation 5:5?"
    }
  ];

  return (
    <div id="dream-vision-journal-container" className="w-full space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Biblical Discernment Sanctum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2D]">
              Interpret Your Dreams & Visions
            </h1>
            <p className="text-[#7A7468] text-xs sm:text-sm mt-1 font-sans">
              Biblical Doctrine • Dreams Interpretation • Visions Interpretation • Biblical Symbols • Scripture Inquiry
            </p>
          </div>

          {(activeTab === "dreams" || activeTab === "visions") && (
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md shadow-[#C5A059]/20 transition-all self-start lg:self-center cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isCreating ? "Cancel" : `Record New ${activeTab === "dreams" ? "Dream" : "Vision"}`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-3 rounded-[28px] border border-[#E5E0D5] shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-1.5 w-full lg:w-auto">
          <button
            onClick={() => {
              setActiveTab("interpret-ai");
              setIsCreating(false);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "interpret-ai"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "bg-[#FAF6EE] text-[#8C6B2D] hover:bg-white hover:text-[#C5A059] border border-[#C5A059]/40"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interpret (AI)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("dreams");
              setIsCreating(false);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dreams"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dreams ({dreams.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("visions");
              setIsCreating(false);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "visions"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Visions ({visions.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("symbols");
              setIsCreating(false);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "symbols"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Biblical Symbols ({BIBLICAL_SYMBOLS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("doctrine");
              setIsCreating(false);
            }}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === "doctrine"
                ? "bg-[#C5A059] text-white shadow-2xs"
                : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#C5A059] border border-[#E5E0D5]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Scripture Inquiry</span>
          </button>
        </div>

        {/* Dynamic Search / Indicator */}
        <div className="relative w-full lg:w-72">
          {activeTab === "dreams" || activeTab === "visions" ? (
            <>
              <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
              />
            </>
          ) : activeTab === "symbols" ? (
            <>
              <Search className="w-4 h-4 text-[#8A8478] absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search symbols, water, oil, eagle..."
                value={symbolSearch}
                onChange={(e) => setSymbolSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
              />
            </>
          ) : (
            <div className="flex items-center gap-2 text-[11px] text-[#7A7468] px-3 py-1.5 bg-[#F9F7F2] rounded-xl border border-[#E5E0D5]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Theological Exegesis Engine Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Entry Creation Form (Dreams & Visions only) */}
      {isCreating && (activeTab === "dreams" || activeTab === "visions") && (
        <div className="bg-white border border-[#C5A059]/50 rounded-[32px] p-6 sm:p-8 shadow-md space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
            <h3 className="font-serif font-bold text-[#2D2D2D] text-lg">
              New {activeTab === "dreams" ? "Dream" : "Vision"} Entry
            </h3>
            <span className="text-xs font-semibold text-[#C5A059] bg-[#FDFCF9] px-3 py-1 rounded-full border border-[#E5E0D5]">
              Encrypted & Private
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-1">
                Title / Theme *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={activeTab === "dreams" ? "e.g., The River of Living Water at Dawn" : "e.g., Vision of the Golden Lampstand"}
                className="w-full px-4 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-1">
                Date Experienced
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-1">
              Description & Specific Details *
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you saw, felt, or heard. Include key colors, objects, locations, and biblical symbols..."
              className="w-full px-4 py-2.5 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-1">
                Key Symbols (comma separated)
              </label>
              <input
                type="text"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                placeholder="e.g., River, Oil, Eagle, White Robe"
                className="w-full px-4 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-1">
                Atmosphere / Emotions
              </label>
              <input
                type="text"
                value={emotions}
                onChange={(e) => setEmotions(e.target.value)}
                placeholder="e.g., Peaceful, Reverent, Urgency"
                className="w-full px-4 py-2 bg-[#F9F7F2] border border-[#E5E0D5] rounded-xl text-xs focus:outline-none focus:border-[#C5A059] focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E5E0D5]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivateCheck"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded text-[#C5A059] focus:ring-[#C5A059]"
              />
              <label htmlFor="isPrivateCheck" className="text-xs text-[#7A7468] cursor-pointer">
                Keep strictly private in my personal sanctum
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-[#E5E0D5] text-[#7A7468] hover:text-[#2D2D2D] rounded-full text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEntry}
                className="px-5 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-white rounded-full text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer transition-all"
              >
                Save {activeTab === "dreams" ? "Dream" : "Vision"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-emerald-900 text-xs sm:text-sm animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccessMsg}</span>
          </div>
          <button
            onClick={() => setSaveSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold text-xs cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 0: INTERPRET DREAMS & VISIONS (AI CENTERPIECE) */}
      {activeTab === "interpret-ai" && (
        <div className="space-y-6">
          {/* Main AI Input Form */}
          <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Biblical Exegesis & Discernment Engine</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2D2D]">
                Interpret Your Dreams & Visions with Scripture
              </h2>
              <p className="text-xs sm:text-sm text-[#7A7468] leading-relaxed max-w-3xl font-sans mt-1">
                Enter your dream, night vision, or prophetic impression. The engine rigorously evaluates all imagery against canonical Scripture (66 Books), identifies biblical symbols, extracts spiritual themes, and provides prayer strategy.
              </p>
            </div>

            {/* Type selector */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: "dream", label: "🌙 Dream (Night Season)", desc: "Job 33:14-16" },
                { id: "vision", label: "☀️ Spiritual Vision", desc: "Acts 2:17" },
                { id: "spiritual_impression", label: "🕊️ Prophetic Impression", desc: "1 Thess 5:21" },
                { id: "symbol", label: "🔍 Biblical Symbol", desc: "Dan 2:19" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setAiInterpretType(item.id as any)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    aiInterpretType === item.id
                      ? "bg-[#C5A059] text-white shadow-2xs"
                      : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white hover:text-[#2D2D2D] border border-[#E5E0D5]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className={`text-[10px] opacity-75 font-normal ${aiInterpretType === item.id ? "text-white" : "text-[#8A8478]"}`}>
                    ({item.desc})
                  </span>
                </button>
              ))}
            </div>

            {/* Large Input & Action */}
            <div className="space-y-3 pt-2">
              <div className="relative">
                <textarea
                  rows={4}
                  value={aiInterpretText}
                  onChange={(e) => setAiInterpretText(e.target.value)}
                  placeholder="Describe in detail what you saw, felt, and heard... (e.g., 'I was standing before a wide, clear river flowing from a high mountain. The water was crystalline, and on both banks were fruitful olive trees with golden light...')"
                  className="w-full p-4 sm:p-5 bg-[#FDFCF9] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-2xl text-xs sm:text-sm font-medium focus:outline-none transition-all placeholder:text-[#AAA498] leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider mr-1">
                    Try Sample:
                  </span>
                  {[
                    { label: "Living Waters & Trees", text: "I saw a crystal clear river flowing with green olive trees on both banks and fruit in every season.", type: "dream" as const },
                    { label: "Eagle Above Storm", text: "I was standing on a mountain when dark storm clouds gathered, but an eagle lifted above the lightning into pure sunlight.", type: "vision" as const },
                    { label: "Golden Oil on Hands", text: "Golden anointing oil was poured over my open hands at the altar, illuminating the room.", type: "symbol" as const },
                    { label: "Lion at City Gate", text: "A majestic lion stood guarding the ancient gates of a city, roaring peacefully and turning away darkness.", type: "vision" as const }
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRunAiInterpretation(s.text, s.type)}
                      className="px-2.5 py-1 bg-[#FAF6EE] hover:bg-[#F2EFE9] text-[#8C6B2D] border border-[#C5A059]/30 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Submit button */}
                <button
                  onClick={() => handleRunAiInterpretation()}
                  disabled={isAiInterpreting || !aiInterpretText.trim()}
                  className="px-6 py-3 bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs rounded-full shadow-md shadow-[#C5A059]/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiInterpreting ? "Consulting Scripture..." : "Interpret with Scripture"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Result View */}
          {aiInterpretResult && (
            <div className="bg-white border border-[#C5A059]/50 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              {/* Result Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-2xl bg-[#FAF6EE] border border-[#C5A059]/40 text-[#C5A059] flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">
                      Scriptural Interpretation & Exegesis
                    </h3>
                    <span className="text-[11px] text-[#7A7468]">
                      Evaluated according to the 66 canonical books of the Holy Bible
                    </span>
                  </div>
                </div>

                {/* Save to Journal Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveAiResultToJournal("dream")}
                    className="px-3.5 py-1.5 bg-[#FAF6EE] hover:bg-[#F2EFE9] text-[#8C6B2D] border border-[#C5A059]/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Save to Dreams</span>
                  </button>
                  <button
                    onClick={() => handleSaveAiResultToJournal("vision")}
                    className="px-3.5 py-1.5 bg-[#FAF6EE] hover:bg-[#F2EFE9] text-[#8C6B2D] border border-[#C5A059]/40 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Save to Visions</span>
                  </button>
                </div>
              </div>

              {/* Biblical Themes */}
              {aiInterpretResult.biblicalThemes && aiInterpretResult.biblicalThemes.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#8A8478] uppercase tracking-wider">Themes:</span>
                  {aiInterpretResult.biblicalThemes.map((theme, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#FAF6EE] text-[#8C6B2D] border border-[#C5A059]/30 rounded-full text-xs font-semibold"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              )}

              {/* Primary Summary Interpretation */}
              <div className="bg-[#FDFCF9] p-5 sm:p-6 rounded-2xl border border-[#E5E0D5] space-y-2">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider font-serif">
                  Core Biblical Meaning
                </span>
                <p className="text-sm sm:text-base text-[#2D2D2D] leading-relaxed font-serif">
                  {aiInterpretResult.summary}
                </p>
              </div>

              {/* 🕊️ Godly Structured Biblical Points */}
              {aiInterpretResult.scannedBiblicalPoints && aiInterpretResult.scannedBiblicalPoints.length > 0 && (
                <div className="p-5 sm:p-6 bg-gradient-to-b from-[#FDFCF9] to-white border-2 border-[#C5A059]/30 rounded-2xl space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E0D5] pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C5A059]" />
                      <h4 className="font-serif font-bold text-[#2D2D2D] text-base">
                        Structured Biblical Points & Principles
                      </h4>
                    </div>
                    {aiInterpretResult.scannerNotice && (
                      <span className="text-[11px] text-[#8A8478] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#C5A059]/30">
                        Canonical Scan Active
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {aiInterpretResult.scannedBiblicalPoints.map((pt) => (
                      <div
                        key={pt.pointNumber}
                        className="p-4 bg-white border border-[#E5E0D5] rounded-xl space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-xs font-bold font-serif">
                              {pt.pointNumber}
                            </span>
                            <span className="font-serif font-bold text-sm text-[#2D2D2D]">
                              {pt.title.replace(/^\d+\.\s*/, "")}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#C5A059] bg-[#C5A059]/10 font-bold px-2 py-0.5 rounded">
                            {pt.covenantTheme}
                          </span>
                        </div>

                        {/* Scripture */}
                        <div className="p-3 bg-[#FDFCF9] rounded-lg border-l-3 border-l-[#C5A059] border border-[#E5E0D5] space-y-1">
                          <div className="text-xs font-bold font-serif text-[#C5A059]">{pt.scriptureRef}</div>
                          <p className="text-xs text-[#2D2D2D] italic leading-relaxed">"{pt.scriptureText}"</p>
                        </div>

                        {/* Principle & Application */}
                        <div className="text-xs text-[#555046] leading-relaxed space-y-1">
                          <p><strong className="text-[#2D2D2D]">Theological Truth:</strong> {pt.theologicalPrinciple}</p>
                          <p><strong className="text-emerald-800">Godly Application:</strong> {pt.practicalApplication}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Symbols & Motifs */}
              {aiInterpretResult.extractedEventsAndSymbols && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInterpretResult.extractedEventsAndSymbols.symbols?.length > 0 && (
                    <div className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-2">
                      <span className="text-xs font-bold text-[#8C6B2D] uppercase tracking-wider block">
                        Decoded Biblical Symbols
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInterpretResult.extractedEventsAndSymbols.symbols.map((sym, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white border border-[#E5E0D5] text-[#2D2D2D] text-xs font-semibold rounded-lg shadow-2xs"
                          >
                            #{sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {aiInterpretResult.extractedEventsAndSymbols.emotions?.length > 0 && (
                    <div className="p-4 bg-[#F9F7F2] rounded-2xl border border-[#E5E0D5] space-y-2">
                      <span className="text-xs font-bold text-[#8C6B2D] uppercase tracking-wider block">
                        Spiritual Atmosphere & Emotions
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {aiInterpretResult.extractedEventsAndSymbols.emotions.map((emo, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-white border border-[#E5E0D5] text-[#7A7468] text-xs font-medium rounded-lg"
                          >
                            {emo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Supporting Canonical Scriptures */}
              {aiInterpretResult.supportingScriptures && aiInterpretResult.supportingScriptures.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-[#C5A059]" />
                    <span>Canonical Scripture Anchors</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {aiInterpretResult.supportingScriptures.map((sc, i) => (
                      <div
                        key={i}
                        className="p-4 bg-[#FDFCF9] border border-[#E5E0D5] rounded-2xl space-y-1.5 hover:border-[#C5A059] transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs text-[#C5A059]">{sc.reference}</span>
                          {onNavigateToBible && (
                            <button
                              onClick={() => {
                                const parts = sc.reference.split(" ");
                                const book = parts.slice(0, -1).join(" ");
                                const chapter = parseInt(parts[parts.length - 1]?.split(":")[0] || "1", 10);
                                onNavigateToBible(book, chapter);
                              }}
                              className="text-[10px] text-[#8C6B2D] hover:underline font-bold uppercase tracking-wider cursor-pointer"
                            >
                              Open in Bible Hub →
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-[#2D2D2D] italic font-serif">
                          "{sc.text}"
                        </p>
                        {sc.whyRelevant && (
                          <p className="text-[11px] text-[#7A7468] pt-1">
                            {sc.whyRelevant}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Practical Guidance & Prayer */}
              {aiInterpretResult.practicalGuidance && (
                <div className="p-5 bg-[#FAF6EE] border border-[#C5A059]/40 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-[#8C6B2D] uppercase tracking-wider">
                    Prayer Strategy & Next Steps
                  </span>
                  <p className="text-xs sm:text-sm text-[#2D2D2D] font-serif leading-relaxed">
                    {aiInterpretResult.practicalGuidance.personalPrayerPrompt}
                  </p>
                  {aiInterpretResult.practicalGuidance.deepReflectionQuestion && (
                    <p className="text-xs text-[#7A7468] italic pt-1">
                      Reflection: "{aiInterpretResult.practicalGuidance.deepReflectionQuestion}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 1: DREAMS */}
      {activeTab === "dreams" && (
        <div className="space-y-4">
          {filteredDreams.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E0D5] rounded-[32px] p-10 text-center text-[#7A7468]">
              <Moon className="w-10 h-10 text-[#C5A059] mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-serif font-bold text-[#2D2D2D]">No Dream Entries Found</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto mt-1 font-sans">
                Record personal dreams, discover biblical symbols, and request scripture-grounded interpretations.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-pointer"
              >
                Record Your First Dream
              </button>
            </div>
          ) : (
            filteredDreams.map((dream) => (
              <div
                key={dream.id}
                className="bg-white border border-[#E5E0D5] rounded-[28px] p-6 shadow-xs hover:border-[#C5A059] transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                      <Moon className="w-4 h-4 text-[#C5A059]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">{dream.title}</h3>
                      <span className="text-[11px] text-[#8A8478] flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#C5A059]" /> {dream.date} • {dream.isPrivate ? "Private" : "Shared with Mentor"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequestAIAnalysis(dream, "dream")}
                      disabled={analyzingId === dream.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDFCF9] hover:bg-[#C5A059] hover:text-white text-[#C5A059] border border-[#E5E0D5] rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                      title="Request Scripture & Symbolic Insight"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{analyzingId === dream.id ? "Analyzing..." : "Scripture Insight"}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(dream.id, "dream")}
                      className="p-2 text-[#8A8478] hover:text-rose-600 rounded-xl cursor-pointer transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-[#2D2D2D] text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-[#FDFCF9] p-4 rounded-2xl border border-[#E5E0D5] font-sans">
                  {dream.description}
                </p>

                {/* Symbols & Emotions chips */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {(dream.symbols || []).map((sym, i) => (
                    <span key={i} className="px-3 py-0.5 bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] rounded-full font-semibold text-[11px]">
                      #{sym}
                    </span>
                  ))}
                  {(dream.emotions || []).map((emo, i) => (
                    <span key={i} className="px-3 py-0.5 bg-[#F9F7F2] text-[#7A7468] border border-[#E5E0D5] rounded-full text-[11px]">
                      {emo}
                    </span>
                  ))}
                </div>

                {/* Embedded AI Insight Result */}
                {dream.aiInsight && (
                  <div className="p-5 bg-[#FDFCF9] border border-[#C5A059]/40 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Biblical Insight & Scripture Anchors</span>
                      </div>
                      <span className="text-[10px] text-[#8A8478] font-semibold">Pastoral Discernment Notice</span>
                    </div>

                    <p className="text-xs text-[#2D2D2D] font-medium leading-relaxed font-sans">{dream.aiInsight.summary}</p>

                    {dream.aiInsight.relevantScriptures && (
                      <div className="space-y-2 pt-1">
                        {(dream.aiInsight.relevantScriptures || []).slice(0, 2).map((sc, i) => (
                          <div key={i} className="text-xs bg-white p-3 rounded-xl border border-[#E5E0D5]">
                            <span className="font-bold text-[#C5A059] font-serif">{sc.reference}: </span>
                            <span className="italic text-[#7A7468]">"{sc.text}"</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: VISIONS */}
      {activeTab === "visions" && (
        <div className="space-y-4">
          {filteredVisions.length === 0 ? (
            <div className="bg-white border border-dashed border-[#E5E0D5] rounded-[32px] p-10 text-center text-[#7A7468]">
              <Sun className="w-10 h-10 text-[#C5A059] mx-auto mb-2 opacity-80" />
              <h3 className="text-sm font-serif font-bold text-[#2D2D2D]">No Vision Entries Found</h3>
              <p className="text-xs text-[#7A7468] max-w-sm mx-auto mt-1 font-sans">
                Record prophetic impressions, spiritual burdens, and visions received during worship.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 px-5 py-2.5 bg-[#C5A059] hover:bg-[#B48F48] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs cursor-pointer"
              >
                Record Your First Vision
              </button>
            </div>
          ) : (
            filteredVisions.map((vision) => (
              <div
                key={vision.id}
                className="bg-white border border-[#E5E0D5] rounded-[28px] p-6 shadow-xs hover:border-[#C5A059] transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-2xl bg-[#FDFCF9] border border-[#E5E0D5] text-[#C5A059] flex items-center justify-center font-bold text-xs">
                      <Sun className="w-4 h-4 text-[#C5A059]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">{vision.title}</h3>
                      <span className="text-[11px] text-[#8A8478] flex items-center gap-2">
                        <Calendar className="w-3 h-3 text-[#C5A059]" /> {vision.date} • {vision.context || "Personal Prayer"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequestAIAnalysis(vision, "vision")}
                      disabled={analyzingId === vision.id}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FDFCF9] hover:bg-[#C5A059] hover:text-white text-[#C5A059] border border-[#E5E0D5] rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{analyzingId === vision.id ? "Analyzing..." : "Scripture Insight"}</span>
                    </button>
                    <button
                      onClick={() => handleDelete(vision.id, "vision")}
                      className="p-2 text-[#8A8478] hover:text-rose-600 rounded-xl cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-[#2D2D2D] text-xs sm:text-sm leading-relaxed bg-[#FDFCF9] p-4 rounded-2xl border border-[#E5E0D5] font-sans">
                  {vision.description}
                </p>

                {(vision.scriptures || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#2D2D2D]">Scriptures:</span>
                    {(vision.scriptures || []).map((sc, i) => (
                      <span key={i} className="px-3 py-0.5 bg-[#FDFCF9] text-[#C5A059] border border-[#E5E0D5] rounded-full font-semibold text-[11px]">
                        {sc}
                      </span>
                    ))}
                  </div>
                )}

                {vision.aiInsight && (
                  <div className="p-5 bg-[#FDFCF9] border border-[#C5A059]/40 rounded-2xl space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider font-serif">
                        <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Prophetic & Biblical Reflection</span>
                      </div>
                      <span className="text-[10px] text-[#8A8478] font-semibold">1 Thess 5:21 Discernment</span>
                    </div>

                    <p className="text-xs text-[#2D2D2D] font-medium leading-relaxed font-sans">{vision.aiInsight.summary}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: BIBLICAL SYMBOLS */}
      {activeTab === "symbols" && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              "ALL",
              "Holy Spirit & Anointing",
              "Kingdom Authority",
              "Purity & Salvation",
              "Divine Guidance",
              "Spiritual Warfare"
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSymbolCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedSymbolCategory === cat
                    ? "bg-[#C5A059] text-white shadow-2xs"
                    : "bg-white text-[#7A7468] hover:text-[#C5A059] border border-[#E5E0D5]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Symbols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSymbols.map((sym) => (
              <div
                key={sym.id}
                className="bg-white border border-[#E5E0D5] rounded-[28px] p-6 shadow-xs hover:border-[#C5A059] transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 bg-[#FAF6EE] text-[#8C6B2D] border border-[#E5E0D5] rounded-full text-[10px] font-bold uppercase tracking-wider mb-1.5">
                        {sym.category}
                      </span>
                      <h3 className="text-lg font-serif font-bold text-[#2D2D2D]">{sym.symbol}</h3>
                    </div>

                    <button
                      onClick={() => handleInquireFromSymbol(sym)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#FDFCF9] hover:bg-[#C5A059] hover:text-white text-[#C5A059] border border-[#E5E0D5] rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 shadow-2xs"
                      title="Run AI Theological Exegesis on this symbol"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Inquire</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#2D2D2D] leading-relaxed font-medium bg-[#FDFCF9] p-3 rounded-xl border border-[#E5E0D5]">
                    {sym.primaryMeaning}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-[#7A7468] uppercase tracking-wider">
                      Canonical Scriptures:
                    </span>
                    <div className="space-y-1.5">
                      {sym.scriptures.map((sc, i) => (
                        <div key={i} className="text-xs bg-white p-2.5 rounded-lg border border-[#E5E0D5]">
                          <span className="font-serif font-bold text-[#C5A059] mr-1.5">{sc.ref}:</span>
                          <span className="italic text-[#7A7468]">"{sc.text}"</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-[#7A7468] space-y-1">
                    <p><strong className="text-[#2D2D2D]">Prophetic Meaning:</strong> {sym.propheticSignificance}</p>
                    <p className="text-amber-800 bg-amber-50/70 p-2 rounded-lg border border-amber-200/50">
                      <strong>Discernment Guard:</strong> {sym.caution}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCRIPTURE INQUIRY & BIBLICAL DOCTRINE */}
      {activeTab === "doctrine" && (
        <div className="space-y-6">
          {/* Inquiry Form */}
          <div className="bg-white border border-[#E5E0D5] rounded-[32px] p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#C5A059]" />
              <span>Canonical Scripture Inquiry & Sound Doctrine</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D2D2D]">
              Inquire of the Scriptures & Test Every Spirit
            </h2>

            <p className="text-xs text-[#7A7468] leading-relaxed max-w-2xl font-sans">
              Enter any biblical doctrine question, dream symbol, vision description, or theological topic. Our engine grounds reflections in verified canonical Scripture (66 Books) with multi-translation comparison.
            </p>

            {/* Type selector */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {[
                { id: "doctrine", label: "Biblical Doctrine" },
                { id: "dream", label: "Dream Interpretation" },
                { id: "vision", label: "Vision Discernment" },
                { id: "symbol", label: "Biblical Symbol" },
                { id: "biblical_question", label: "General Scripture Inquiry" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setInquiryType(item.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    inquiryType === item.id
                      ? "bg-[#C5A059] text-white shadow-2xs"
                      : "bg-[#F9F7F2] text-[#7A7468] hover:bg-white border border-[#E5E0D5]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input & Action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <textarea
                rows={2}
                value={inquiryQuery}
                onChange={(e) => setInquiryQuery(e.target.value)}
                placeholder="Ask about a scripture, doctrine, dream scenario, or spiritual symbol..."
                className="flex-1 px-4 py-2.5 bg-[#F9F7F2] border border-[#E5E0D5] focus:border-[#C5A059] focus:bg-white rounded-2xl text-xs font-medium focus:outline-none transition-all placeholder:text-[#AAA498]"
              />
              <button
                onClick={() => handleRunInquiry()}
                disabled={isInquiring || !inquiryQuery.trim()}
                className="px-6 py-3 bg-[#C5A059] hover:bg-[#B48F48] disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isInquiring ? "Exegesis in Progress..." : "Inquire Scripture"}</span>
              </button>
            </div>

            {/* Presets */}
            <div className="pt-2 border-t border-[#E5E0D5] space-y-2">
              <span className="text-[11px] font-bold text-[#8A8478] uppercase tracking-wider block">
                Quick Scriptural Inquiries:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleInquiries.map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => handleRunInquiry(sample.query, sample.type)}
                    className="px-3 py-1 bg-[#FDFCF9] hover:bg-[#F4EEDC] text-[#8C6B2D] border border-[#E5E0D5] rounded-full text-xs font-medium transition-all text-left cursor-pointer"
                  >
                    {sample.label} →
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Inquiry Results */}
          {inquiryResult && (
            <div className="bg-white border border-[#C5A059]/40 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">Theological Exegesis & Biblical Finding</h3>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                  Canonical 66 Books
                </span>
              </div>

              {/* Summary */}
              <div className="bg-[#FDFCF9] p-5 rounded-2xl border border-[#E5E0D5] space-y-2">
                <span className="text-xs font-bold text-[#C5A059] uppercase tracking-wider block font-serif">
                  Theological Synthesis:
                </span>
                <p className="text-xs sm:text-sm text-[#2D2D2D] leading-relaxed font-sans font-medium whitespace-pre-line">
                  {inquiryResult.summary}
                </p>
              </div>

              {/* Verified Scriptures */}
              {inquiryResult.relevantScriptures && inquiryResult.relevantScriptures.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider font-serif">
                    Scripture Anchors & Canonical Context:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {inquiryResult.relevantScriptures.map((sc, i) => (
                      <div key={i} className="bg-[#FDFCF9] p-4 rounded-2xl border border-[#E5E0D5] space-y-1.5">
                        <span className="text-xs font-bold text-[#C5A059] font-serif block">
                          {sc.reference}
                        </span>
                        <p className="text-xs text-[#2D2D2D] italic leading-relaxed">
                          "{sc.text}"
                        </p>
                        {sc.context && (
                          <p className="text-[11px] text-[#8A8478] pt-1">
                            <strong>Context:</strong> {sc.context}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Multi-Version Comparison if available */}
              {inquiryResult.versionComparisons && inquiryResult.versionComparisons.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider font-serif">
                    Multi-Translation Comparison:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {inquiryResult.versionComparisons.map((v, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-[#E5E0D5] space-y-1">
                        <span className="text-[10px] font-bold text-[#C5A059] uppercase tracking-wider block">
                          {v.version} ({v.style || "Canonical"})
                        </span>
                        <p className="text-xs text-[#2D2D2D] italic leading-relaxed">
                          "{v.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pastoral Discernment Notice */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/70 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Apostolic Discernment Notice (1 Thessalonians 5:21)</p>
                  <p className="mt-0.5 text-[#7A7468]">
                    Scriptural reflections are educational aids grounded in God's Holy Word. They guide personal meditation and prayer under the lordship of Jesus Christ and the guidance of the Holy Spirit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
