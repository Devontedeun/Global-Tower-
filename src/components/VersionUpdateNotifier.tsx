import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles, X, CheckCircle2, ShieldCheck, Wifi, AlertTriangle } from 'lucide-react';
import { backgroundMaintenance, SystemHealthReport } from '../lib/backgroundMaintenance';

interface VersionResponse {
  version: string;
  bootTime: string;
  name: string;
  status: string;
}

interface SelfHealToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export function VersionUpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [serverVersion, setServerVersion] = useState<string>('');
  const [activeToast, setActiveToast] = useState<SelfHealToast | null>(null);

  // Store the initial client boot timestamp
  const clientBootTime = React.useMemo(() => {
    try {
      return typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : new Date().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }, []);

  const currentAppVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.1';

  const checkForUpdate = async () => {
    try {
      const res = await fetch(`/api/version?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (!res.ok) return;
      const data: VersionResponse = await res.json();

      if (data && data.bootTime) {
        const serverDate = new Date(data.bootTime).getTime();
        const clientDate = new Date(clientBootTime).getTime();

        if (data.version !== currentAppVersion || (serverDate > clientDate && serverDate - clientDate > 5000)) {
          setServerVersion(data.version);
          setUpdateAvailable(true);
        }
      }
    } catch (err) {
      console.debug('Background version check deferred:', err);
    }
  };

  useEffect(() => {
    // 1. Initial check after 15 seconds
    const initialTimer = setTimeout(() => {
      checkForUpdate();
    }, 15000);

    // 2. Periodic check every 2 minutes
    const interval = setInterval(() => {
      checkForUpdate();
    }, 120000);

    // 3. Check when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    // 4. Custom window event listener for manual trigger
    const handleManualTrigger = () => {
      checkForUpdate();
      backgroundMaintenance.runSelfHealingCheck().then((report: SystemHealthReport) => {
        showHealToast({
          id: `health-check-${Date.now()}`,
          title: `Sanctuary Status: ${report.score}/100`,
          message: report.score >= 90 ? "Sanctuary verified and fully synchronized." : "Sanctuary active with offline resilience.",
          type: "success"
        });
      });
    };

    // 5. Listen for general network/sanctuary notifications (e.g. online/offline restoration)
    const handleSystemNotification = (e: any) => {
      const detail = e.detail;
      if (detail && detail.title) {
        showHealToast({
          id: `notify-${Date.now()}`,
          title: detail.title,
          message: detail.message,
          type: detail.type || "info"
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('gtc_check_for_updates', handleManualTrigger);
    window.addEventListener('gtc_system_notification', handleSystemNotification);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('gtc_check_for_updates', handleManualTrigger);
      window.removeEventListener('gtc_system_notification', handleSystemNotification);
    };
  }, [clientBootTime, currentAppVersion]);

  const showHealToast = (toast: SelfHealToast) => {
    setActiveToast(toast);
    setTimeout(() => {
      setActiveToast((current) => (current?.id === toast.id ? null : current));
    }, 4500);
  };

  const handleApplyUpdate = () => {
    try {
      sessionStorage.removeItem('gtc_chunk_reload_time');
    } catch {}
    window.location.reload();
  };

  return (
    <>
      {/* 1. Self-Healing Temporary Toast (Auto-dismisses in 4.5s, then stays dormant) */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-16 right-4 sm:right-6 z-50 max-w-sm w-[calc(100vw-2rem)] sm:w-auto pointer-events-auto"
          >
            <div className="bg-[#1A1815]/95 text-[#FDFCF9] border border-[#C5A059]/40 rounded-xl shadow-xl p-3.5 flex items-start gap-3 backdrop-blur-md">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0 mt-0.5">
                {activeToast.type === 'warning' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-[#E5C358]" />
                )}
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h5 className="font-serif font-bold text-xs text-[#FDFCF9] leading-snug">
                  {activeToast.title}
                </h5>
                <p className="text-[11px] text-[#D5CEBF] leading-normal mt-0.5">
                  {activeToast.message}
                </p>
              </div>
              <button
                onClick={() => setActiveToast(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Release & Version Update Available Banner */}
      <AnimatePresence>
        {updateAvailable && !isDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto pointer-events-auto"
          >
            <div className="bg-[#1F1A10] text-[#FDFCF9] border border-[#C5A059]/60 rounded-2xl shadow-2xl p-4 flex items-center gap-3 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#E5C358] animate-pulse" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-sm text-[#FDFCF9] leading-snug">
                    Sanctuary Update Available
                  </h4>
                  {serverVersion && (
                    <span className="text-[10px] bg-[#C5A059]/30 text-[#E5C358] px-1.5 py-0.2 rounded-sm font-mono">
                      v{serverVersion}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#CBD5E1] line-clamp-1">
                  A fresh release was deployed. Refresh to apply latest improvements.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleApplyUpdate}
                  className="px-3.5 py-1.5 bg-[#C5A059] hover:bg-[#D4AF37] active:scale-95 text-[#1F1A10] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Refresh to latest version"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>

                <button
                  onClick={() => setIsDismissed(true)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
