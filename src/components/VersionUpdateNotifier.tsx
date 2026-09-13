import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Sparkles, X, CheckCircle2 } from 'lucide-react';

interface VersionResponse {
  version: string;
  bootTime: string;
  name: string;
  status: string;
}

export function VersionUpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [serverVersion, setServerVersion] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

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
      setIsChecking(true);
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
        // Compare server boot time with client boot time
        // If server booted after client, or version differs, a new deployment happened!
        const serverDate = new Date(data.bootTime).getTime();
        const clientDate = new Date(clientBootTime).getTime();

        if (data.version !== currentAppVersion || (serverDate > clientDate && serverDate - clientDate > 5000)) {
          setServerVersion(data.version);
          setUpdateAvailable(true);
        }
      }
    } catch (err) {
      console.debug('Background version check deferred:', err);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check after 30 seconds
    const initialTimer = setTimeout(() => {
      checkForUpdate();
    }, 30000);

    // Periodic check every 3 minutes
    const interval = setInterval(() => {
      checkForUpdate();
    }, 180000);

    // Check when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdate();
      }
    };

    // Custom window event listener so user can trigger "Check for Updates" from settings/profile
    const handleManualTrigger = () => {
      checkForUpdate();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('gtc_check_for_updates', handleManualTrigger);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('gtc_check_for_updates', handleManualTrigger);
    };
  }, [clientBootTime, currentAppVersion]);

  const handleApplyUpdate = () => {
    try {
      // Clear session reload throttle
      sessionStorage.removeItem('gtc_chunk_reload_time');
    } catch {}
    window.location.reload();
  };

  if (!updateAvailable || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto"
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
    </AnimatePresence>
  );
}
