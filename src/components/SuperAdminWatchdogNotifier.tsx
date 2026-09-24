import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  RefreshCw,
  X,
  Radio,
  Terminal,
  Database,
  Volume2,
  VolumeX,
  Cpu,
  Globe,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Bell,
  Smartphone
} from "lucide-react";
import {
  backgroundMaintenance,
  WatchdogIncident,
  SystemHealthReport
} from "../lib/backgroundMaintenance";
import { isSuperAdminEmail, Storage } from "../lib/storage";
import { useAuth } from "../lib/AuthContext";
import { watchdogThunderService } from "../lib/watchdogThunderService";

interface SuperAdminWatchdogNotifierProps {
  // Optional override if passed directly
  isSuperAdmin?: boolean;
}

export function SuperAdminWatchdogNotifier({ isSuperAdmin: propIsSuperAdmin }: SuperAdminWatchdogNotifierProps) {
  const { currentUser, userProfile } = useAuth();
  const [activeAlert, setActiveAlert] = useState<WatchdogIncident | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [incidents, setIncidents] = useState<WatchdogIncident[]>(() => backgroundMaintenance.getIncidents());
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(() => backgroundMaintenance.getLastReport());
  const [isFixing, setIsFixing] = useState(false);
  const [fixMessage, setFixMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isThunderSoundOn, setIsThunderSoundOn] = useState(() => watchdogThunderService.isSoundEnabled());
  const [isScreenVibeOn, setIsScreenVibeOn] = useState(() => watchdogThunderService.isScreenVibrationEnabled());
  const [notifStatus, setNotifStatus] = useState<string>(() =>
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );

  // STRICT SUPER ADMIN CHECK:
  // Only users who are super_admin or have an Apostle / Founder email can receive these notifications!
  const storedUser = typeof window !== "undefined" ? Storage.getUser() : null;
  const isSuperAdmin =
    propIsSuperAdmin ??
    (userProfile?.role === "super_admin" ||
      userProfile?.role === "ministry_admin" ||
      (userProfile?.role as string) === "admin" ||
      storedUser?.role === "super_admin" ||
      storedUser?.role === "ministry_admin" ||
      (storedUser?.role as string) === "admin" ||
      isSuperAdminEmail(userProfile?.email || currentUser?.email || storedUser?.email || ""));

  // Listen to health report changes
  useEffect(() => {
    if (!isSuperAdmin) return;

    const unsubHealth = backgroundMaintenance.onHealthChange(setHealthReport);
    const unsubIncident = backgroundMaintenance.onIncident((newIncident) => {
      setIncidents(backgroundMaintenance.getIncidents());
      // Pop up alert toast for Super Admin
      if (!newIncident.resolved) {
        setActiveAlert(newIncident);
      }
    });

    // Also listen to custom event dispatched by watchdog
    const handleCustomIncident = (e: any) => {
      const incident = e.detail as WatchdogIncident;
      if (incident) {
        setIncidents(backgroundMaintenance.getIncidents());
        if (!incident.resolved) {
          setActiveAlert(incident);
        }
      }
    };

    // Custom event to trigger opening the watchdog console directly
    const handleOpenConsole = () => {
      setIsConsoleOpen(true);
    };

    window.addEventListener("gtc_superadmin_watchdog_incident", handleCustomIncident);
    window.addEventListener("gtc_open_watchdog_console", handleOpenConsole);

    return () => {
      unsubHealth();
      unsubIncident();
      window.removeEventListener("gtc_superadmin_watchdog_incident", handleCustomIncident);
      window.removeEventListener("gtc_open_watchdog_console", handleOpenConsole);
    };
  }, [isSuperAdmin]);

  // If user is not super admin, render nothing (no watchdog alerts or UI shown to regular users)
  if (!isSuperAdmin) {
    return null;
  }

  const handleExecuteFix = async (incident: WatchdogIncident) => {
    const action = incident.howToFix.recommendedOneClickAction;
    if (!action) return;

    setIsFixing(true);
    setFixMessage(null);
    try {
      const result = await backgroundMaintenance.executeOneClickFix(action);
      setFixMessage(result.message);
      setIncidents(backgroundMaintenance.getIncidents());
      setTimeout(() => {
        setFixMessage(null);
        if (result.success) {
          setActiveAlert(null);
        }
      }, 3500);
    } catch (e: any) {
      setFixMessage(`Fix error: ${e?.message || "Operation failed"}`);
    } finally {
      setIsFixing(false);
    }
  };

  const handleResolve = (id: string) => {
    backgroundMaintenance.resolveIncident(id);
    setIncidents(backgroundMaintenance.getIncidents());
    if (activeAlert?.id === id) {
      setActiveAlert(null);
    }
  };

  const handleCopyDiagnostics = (incident: WatchdogIncident) => {
    const json = JSON.stringify(incident, null, 2);
    navigator.clipboard.writeText(json);
    setCopiedId(incident.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSubsystemIcon = (subsystem: string) => {
    switch (subsystem) {
      case "api":
        return <Radio className="w-4 h-4 text-emerald-500" />;
      case "storage":
        return <Database className="w-4 h-4 text-amber-500" />;
      case "audio":
        return <Volume2 className="w-4 h-4 text-blue-500" />;
      case "bundle":
        return <Layers className="w-4 h-4 text-purple-500" />;
      case "network":
        return <Globe className="w-4 h-4 text-rose-500" />;
      case "ai_service":
        return <Sparkles className="w-4 h-4 text-[#C5A059]" />;
      default:
        return <Cpu className="w-4 h-4 text-stone-500" />;
    }
  };

  const unresolvedCount = incidents.filter((i) => !i.resolved).length;

  return (
    <>
      {/* 1. FLOATING SUPER ADMIN WATCHDOG ALERT BANNER (Only pops up for Super Admin when problem is detected) */}
      <AnimatePresence>
        {activeAlert && !activeAlert.resolved && (
          <motion.div
            key={activeAlert.id}
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              x: [0, -14, 14, -12, 12, -8, 8, -4, 4, 0],
              rotate: [0, -1.2, 1.2, -0.8, 0.8, -0.4, 0.4, 0]
            }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{
              x: { duration: 0.85, ease: "easeInOut" },
              rotate: { duration: 0.85, ease: "easeInOut" },
              opacity: { duration: 0.25 },
              y: { duration: 0.3 }
            }}
            className="fixed top-20 right-4 sm:right-8 z-50 max-w-lg w-[calc(100vw-2rem)] sm:w-auto pointer-events-auto"
          >
            <div className="bg-[#19150E] text-[#FDFCF9] border-2 border-[#C5A059] rounded-2xl shadow-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden">
              {/* Subtle gold decorative glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#C5A059]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Alert Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#C5A059]/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-[#C5A059] text-[#19150E] px-2 py-0.5 rounded-sm">
                        SUPER ADMIN ALERT
                      </span>
                      <span className="text-[10px] text-[#A89F91] uppercase font-mono">
                        {activeAlert.subsystem.toUpperCase()} SUBSYSTEM
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#FDFCF9] mt-0.5 leading-snug">
                      {activeAlert.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      watchdogThunderService.triggerThunder({
                        incident: activeAlert,
                        intensity: "apocalyptic"
                      })
                    }
                    className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-mono font-bold rounded-md border border-amber-400/40 flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                    title="Vibrate the screen with thunder"
                  >
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>VIBRATE</span>
                  </button>

                  <button
                    onClick={() => setActiveAlert(null)}
                    className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Problem Section */}
              <div className="py-3 space-y-2">
                <div className="bg-[#262016] border border-[#C5A059]/30 rounded-xl p-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5 font-mono">
                    Problem Observed:
                  </span>
                  <p className="text-xs text-[#E5DFD3] leading-relaxed">
                    {activeAlert.problem}
                  </p>
                </div>

                {/* Auto-repaired notice */}
                {activeAlert.remedyActionTaken && (
                  <div className="text-[11px] text-emerald-400 flex items-start gap-1.5 px-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Watchdog Action:</strong> {activeAlert.remedyActionTaken}</span>
                  </div>
                )}

                {/* How to Fix It */}
                <div className="bg-[#1C251C] border border-emerald-600/40 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                      <Wrench className="w-3 h-3" />
                      <span>How To Fix It:</span>
                    </span>
                    <span className="text-[9px] text-emerald-300/80">Apostolic Action Guide</span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-200">
                    {activeAlert.howToFix.summary}
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-emerald-100/90 space-y-0.5 pt-0.5">
                    {activeAlert.howToFix.steps.slice(0, 2).map((step, idx) => (
                      <li key={idx} className="leading-tight">{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Fix Status Message */}
              {fixMessage && (
                <div className="mb-2 p-2 bg-[#C5A059]/20 border border-[#C5A059] rounded-lg text-xs text-[#E5C358] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{fixMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setIsConsoleOpen(true)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#E5DFD3] text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Inspect & All Fixes</span>
                </button>

                <div className="flex items-center gap-2">
                  {activeAlert.howToFix.recommendedOneClickAction && (
                    <button
                      onClick={() => handleExecuteFix(activeAlert)}
                      disabled={isFixing}
                      className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] active:scale-95 text-[#19150E] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFixing ? "animate-spin" : ""}`} />
                      <span>{isFixing ? "Fixing..." : "Execute 1-Click Fix"}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleResolve(activeAlert.id)}
                    className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors cursor-pointer"
                    title="Mark resolved"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SUPER ADMIN WATCHDOG FULL CONSOLE MODAL */}
      <AnimatePresence>
        {isConsoleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-[#1C1811] text-[#FDFCF9] border-2 border-[#C5A059]/60 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 sm:p-6 border-b border-[#C5A059]/30 flex items-center justify-between bg-[#15120C]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#C5A059]/20 border border-[#C5A059]/50 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-[#E5C358]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-lg text-[#FDFCF9]">
                        Super Admin Watchdog Console
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#C5A059]/30 text-[#E5C358] border border-[#C5A059]/40">
                        Apostolic Telemetry
                      </span>
                    </div>
                    <p className="text-xs text-[#A89F91]">
                      Real-time anomaly detection, self-healing logs, and step-by-step remediation guide.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsConsoleOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Apostolic Thunder & Haptic Vibration Control Strip */}
              <div className="px-5 sm:px-6 py-2.5 bg-[#1F1910] border-b border-[#C5A059]/30 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                    <span>THUNDER WATCHDOG</span>
                  </div>

                  <span className="hidden sm:inline text-neutral-400 text-[11px]">
                    Screen vibrates with thunder on incident detection
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Sound Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isThunderSoundOn;
                      setIsThunderSoundOn(next);
                      watchdogThunderService.setSoundEnabled(next);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isThunderSoundOn
                        ? "bg-[#C5A059]/20 border-[#C5A059] text-amber-300 font-semibold"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200"
                    }`}
                    title={isThunderSoundOn ? "Thunder sound enabled" : "Thunder sound muted"}
                  >
                    {isThunderSoundOn ? (
                      <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span>Sound: {isThunderSoundOn ? "ON" : "OFF"}</span>
                  </button>

                  {/* Screen Vibration Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isScreenVibeOn;
                      setIsScreenVibeOn(next);
                      watchdogThunderService.setScreenVibrationEnabled(next);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      isScreenVibeOn
                        ? "bg-[#C5A059]/20 border-[#C5A059] text-amber-300 font-semibold"
                        : "bg-white/5 border-white/10 text-neutral-400 hover:text-neutral-200"
                    }`}
                    title={isScreenVibeOn ? "Screen vibration & haptics enabled" : "Screen vibration disabled"}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Screen Shake: {isScreenVibeOn ? "ON" : "OFF"}</span>
                  </button>

                  {/* Desktop Push Notification Request */}
                  {notifStatus !== "granted" && (
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await watchdogThunderService.requestNotificationPermission();
                        setNotifStatus(res);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Enable OS system notifications for critical anomalies"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-400" />
                      <span>{notifStatus === "denied" ? "Push: Blocked" : "Enable Push"}</span>
                    </button>
                  )}

                  {/* Test Approved Ping Blessing Button (God Rays & Floating Doves) */}
                  <button
                    type="button"
                    onClick={() => {
                      backgroundMaintenance.triggerTestApproval();
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Simulate 5-minute approved ping with God rays, floating doves & peaceful chirping"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                    <span>Test Approved Ping (Doves & Rays)</span>
                  </button>

                  {/* Test Thunder & Vibration Button (Uh Oh) */}
                  <button
                    type="button"
                    onClick={() => {
                      watchdogThunderService.triggerThunder({
                        intensity: "apocalyptic",
                        incident: {
                          id: `test-${Date.now()}`,
                          title: "Thunder Screen Vibration Test Probe (Uh Oh)",
                          problem: "Simulated Watchdog anomaly probe triggered by Super Admin.",
                          remedyActionTaken: "Web Audio thunder acoustic synthesizer & haptic screen tremor active.",
                          subsystem: "api",
                          severity: "critical",
                          resolved: false,
                        },
                      });
                    }}
                    className="px-3 py-1 rounded-lg bg-[#C5A059] hover:bg-[#D4AF37] active:scale-95 text-[#19150E] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Vibrate the screen and play acoustic rolling thunder for an uh-oh"
                  >
                    <Zap className="w-3.5 h-3.5 text-[#19150E] fill-[#19150E]" />
                    <span>Test Thunder (Uh Oh)</span>
                  </button>
                </div>
              </div>

              {/* Subsystem Radar Banner */}
              <div className="px-5 sm:px-6 py-3 bg-[#241E15] border-b border-[#C5A059]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#A89F91]">Overall Score:</span>
                    <span className="font-mono font-bold text-[#E5C358]">
                      {healthReport ? `${healthReport.score}/100` : "100/100"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#A89F91]">API Ping:</span>
                    <span className="font-mono text-emerald-400">
                      {healthReport?.latencyMs !== null && healthReport?.latencyMs !== undefined
                        ? `${healthReport.latencyMs}ms`
                        : "Active"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#A89F91]">Active Issues:</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.2 rounded-full ${
                        unresolvedCount > 0
                          ? "bg-rose-500/30 text-rose-300 border border-rose-500/50"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {unresolvedCount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      backgroundMaintenance.triggerTestProbe();
                      setIncidents(backgroundMaintenance.getIncidents());
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg text-neutral-200 transition-colors cursor-pointer"
                    title="Simulate probe to test Super Admin notification delivery"
                  >
                    Test Probe
                  </button>
                  <button
                    onClick={() => {
                      backgroundMaintenance.resolveAllIncidents();
                      setIncidents(backgroundMaintenance.getIncidents());
                    }}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-xs rounded-lg text-neutral-200 transition-colors cursor-pointer"
                  >
                    Resolve All
                  </button>
                </div>
              </div>

              {/* Incidents List & Guides */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
                {incidents.length === 0 ? (
                  <div className="text-center py-12 space-y-3 bg-[#241E15]/50 rounded-2xl border border-[#C5A059]/20 p-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#FDFCF9]">
                      All Subsystems Verified & Operational
                    </h4>
                    <p className="text-xs text-[#A89F91] max-w-md mx-auto">
                      The watchdog is running silently in the background. If any storage anomaly, network stall, or container issue occurs, it will automatically heal the fault and alert you here with the exact problem and how to fix it.
                    </p>
                  </div>
                ) : (
                  incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        incident.resolved
                          ? "bg-[#181510]/50 border-neutral-800 text-neutral-400"
                          : "bg-[#251F16] border-[#C5A059]/40 shadow-lg"
                      }`}
                    >
                      {/* Incident Header */}
                      <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                            {getSubsystemIcon(incident.subsystem)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-sm font-bold ${
                                  incident.severity === "critical"
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                    : incident.severity === "warning"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                }`}
                              >
                                {incident.severity}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {new Date(incident.timestamp).toLocaleTimeString()}
                              </span>
                              {incident.resolved && (
                                <span className="text-[9px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.2 rounded-full">
                                  Resolved
                                </span>
                              )}
                            </div>
                            <h4 className="font-serif font-bold text-sm text-[#FDFCF9] mt-0.5">
                              {incident.title}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyDiagnostics(incident)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            title="Copy incident diagnostic JSON"
                          >
                            {copiedId === incident.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          {!incident.resolved && (
                            <button
                              onClick={() => handleResolve(incident.id)}
                              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-lg transition-colors cursor-pointer"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Problem Details */}
                      <div className="py-3 space-y-2.5">
                        <div className="bg-black/30 border border-white/5 rounded-xl p-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1 font-mono">
                            Problem Observed by Watchdog:
                          </span>
                          <p className="text-xs text-[#E5DFD3] leading-relaxed font-sans">
                            {incident.problem}
                          </p>
                          {incident.technicalDetails && (
                            <pre className="mt-2 text-[10px] text-neutral-400 font-mono bg-black/50 p-2 rounded-lg overflow-x-auto">
                              {incident.technicalDetails}
                            </pre>
                          )}
                        </div>

                        {incident.remedyActionTaken && (
                          <div className="text-xs text-emerald-400 flex items-start gap-1.5 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                            <div>
                              <strong className="block text-[10px] uppercase font-mono text-emerald-300">
                                Automatic Self-Healing Applied:
                              </strong>
                              <span>{incident.remedyActionTaken}</span>
                            </div>
                          </div>
                        )}

                        {/* Step-by-Step "How to Fix It" Section */}
                        <div className="bg-[#182618]/90 border border-emerald-500/40 rounded-xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-mono">
                              <Wrench className="w-3.5 h-3.5 text-emerald-400" />
                              <span>How To Fix It (Apostolic Remediation Guide):</span>
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-emerald-200">
                            {incident.howToFix.summary}
                          </p>
                          <ol className="list-decimal list-inside text-xs text-emerald-100/90 space-y-1 pt-1">
                            {incident.howToFix.steps.map((step, idx) => (
                              <li key={idx} className="leading-relaxed">
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* 1-Click Fix Action Bar */}
                      {!incident.resolved && incident.howToFix.recommendedOneClickAction && (
                        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
                          <span className="text-[11px] text-neutral-400">
                            Actionable 1-Click Watchdog Remedy:
                          </span>
                          <button
                            onClick={() => handleExecuteFix(incident)}
                            disabled={isFixing}
                            className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] active:scale-95 text-[#19150E] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isFixing ? "animate-spin" : ""}`} />
                            <span>
                              {isFixing
                                ? "Executing Repair..."
                                : `Execute Fix: ${incident.howToFix.recommendedOneClickAction.replace("_", " ")}`}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t border-[#C5A059]/30 bg-[#15120C] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#A89F91]">
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>Authorized for Super Admin & Apostle R.Sango only</span>
                </div>
                <button
                  onClick={() => setIsConsoleOpen(false)}
                  className="px-5 py-2 bg-[#C5A059] hover:bg-[#B48F48] text-[#19150E] font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Super Admin Top Bar Watchdog Indicator Badge
 * Appears next to Profile / Settings ONLY if the logged-in user is a Super Admin.
 */
interface SuperAdminWatchdogBadgeProps {
  isSuperAdmin?: boolean;
}

export function SuperAdminWatchdogBadge({ isSuperAdmin: propIsSuperAdmin }: SuperAdminWatchdogBadgeProps = {}) {
  const { currentUser, userProfile } = useAuth();
  const [incidents, setIncidents] = useState<WatchdogIncident[]>(() => backgroundMaintenance.getIncidents());
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(() => backgroundMaintenance.getLastReport());

  const isSuperAdmin =
    propIsSuperAdmin ??
    (userProfile?.role === "super_admin" ||
      userProfile?.role === "ministry_admin" ||
      (userProfile?.role as string) === "admin" ||
      isSuperAdminEmail(userProfile?.email || currentUser?.email || ""));

  useEffect(() => {
    if (!isSuperAdmin) return;
    const unsubHealth = backgroundMaintenance.onHealthChange(setHealthReport);
    const unsubIncident = backgroundMaintenance.onIncident(() => {
      setIncidents(backgroundMaintenance.getIncidents());
    });
    return () => {
      unsubHealth();
      unsubIncident();
    };
  }, [isSuperAdmin]);

  // Strictly hidden for regular users
  if (!isSuperAdmin) return null;

  const unresolvedCount = incidents.filter((i) => !i.resolved).length;

  const handleOpenWatchdog = () => {
    window.dispatchEvent(new CustomEvent("gtc_open_watchdog_console"));
  };

  return (
    <button
      onClick={handleOpenWatchdog}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
        unresolvedCount > 0
          ? "bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 animate-pulse"
          : "bg-[#FAF6EE] border-[#C5A059]/60 text-[#8C6B2D] hover:bg-[#F5EED9]"
      }`}
      title={
        unresolvedCount > 0
          ? `Super Admin Watchdog: ${unresolvedCount} active issue(s) detected. Click to inspect & fix.`
          : "Super Admin Watchdog: All Subsystems Optimal (100/100). Click to open console."
      }
    >
      <ShieldCheck className={`w-3.5 h-3.5 ${unresolvedCount > 0 ? "text-rose-600" : "text-[#C5A059]"}`} />
      <span className="font-mono text-[11px] font-bold">
        {unresolvedCount > 0 ? `${unresolvedCount} Alert` : "Watchdog 100%"}
      </span>
    </button>
  );
}
