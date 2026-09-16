/**
 * Watchdog Blessing & Approval Service
 * Provides heavenly god rays volumetric light, floating doves/pigeons animation,
 * peaceful avian chirping & cooing audio synthesis (Web Audio API),
 * and Super Admin confirmation notifications whenever the 5-minute watchdog ping approves.
 */

export interface WatchdogApprovalData {
  pingCount: number;
  score: number;
  latencyMs?: number | null;
  serverUptimeSeconds?: number;
  timestamp: number;
  message?: string;
  source?: "periodic_5m_ping" | "manual_probe" | "self_heal_pass";
}

const PREF_APPROVAL_SOUND = "gtc_watchdog_approval_sound_enabled";

class WatchdogApprovalService {
  private isAudioEnabled: boolean = true;
  private lastApprovalTimestamp: number = 0;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const soundPref = localStorage.getItem(PREF_APPROVAL_SOUND);
        if (soundPref !== null) {
          this.isAudioEnabled = soundPref !== "false";
        }
      } catch {}
    }
  }

  public isSoundEnabled(): boolean {
    return this.isAudioEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.isAudioEnabled = enabled;
    try {
      localStorage.setItem(PREF_APPROVAL_SOUND, String(enabled));
    } catch {}
  }

  /**
   * Triggers the full Approved Ping confirmation:
   * 1. Radiant celestial God Rays streaming down screen
   * 2. Peaceful white doves / pigeons floating down across the viewport
   * 3. Peaceful avian chirping and gentle dove cooing synthesized via Web Audio API
   * 4. Admin approval notification message
   * 5. OS desktop notification for Super Admin
   */
  public triggerApproval(data?: Partial<WatchdogApprovalData>): void {
    if (typeof window === "undefined") return;

    const now = Date.now();
    // Prevent overlapping spam triggers within 10 seconds unless manually triggered
    if (data?.source !== "manual_probe" && now - this.lastApprovalTimestamp < 10000) {
      return;
    }
    this.lastApprovalTimestamp = now;

    const approvalPayload: WatchdogApprovalData = {
      pingCount: data?.pingCount ?? 1,
      score: data?.score ?? 100,
      latencyMs: data?.latencyMs ?? 18,
      serverUptimeSeconds: data?.serverUptimeSeconds ?? 3600,
      timestamp: now,
      message: data?.message || "5-Minute Watchdog Ping Approved: All Subsystems Reverent & 100% Optimal",
      source: data?.source || "periodic_5m_ping",
    };

    console.log("[WatchdogApproval] 🕊️ Watchdog Ping Approved! Releasing God Rays, Doves & Peaceful Chirping.", approvalPayload);

    // 1. Dispatch custom DOM event for React Visual Overlay (God Rays & Floating Doves)
    window.dispatchEvent(
      new CustomEvent("gtc_watchdog_approval_event", {
        detail: approvalPayload,
      })
    );

    // 2. Play peaceful dove cooing & sweet bird chirps via Web Audio API
    if (this.isAudioEnabled) {
      this.playPeacefulChirpingAudio();
    }

    // 3. Dispatch admin system message
    this.sendAdminApprovalNotification(approvalPayload);
  }

  /**
   * Synthesizes sweet peaceful woodland birdsong chirping and holy dove cooing
   * entirely in-browser with the Web Audio API — zero external files, zero latency,
   * completely reliable and peaceful.
   */
  public playPeacefulChirpingAudio(): void {
    if (typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const t0 = ctx.currentTime;

      // Helper: Gentle Holy Dove Coo (low resonant sine with soft envelope)
      const playDoveCoo = (
        startTime: number,
        duration: number,
        startFreq: number,
        peakFreq: number,
        endFreq: number,
        gainLevel = 0.18
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.linearRampToValueAtTime(peakFreq, startTime + duration * 0.35);
        osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + duration);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(850, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(gainLevel, startTime + duration * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      };

      // Helper: Melodious Avian Chirp / Warble (frequency sweep with vibrato)
      const playBirdChirp = (
        startTime: number,
        f1: number,
        f2: number,
        f3: number,
        duration: number,
        gainLevel = 0.12
      ) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();

        // Vibrato adds sweet authentic warble to the bird chirp
        vibrato.frequency.setValueAtTime(18, startTime);
        vibratoGain.gain.setValueAtTime(120, startTime);
        vibrato.connect(osc.frequency);

        osc.type = "sine";
        osc.frequency.setValueAtTime(f1, startTime);
        osc.frequency.exponentialRampToValueAtTime(f2, startTime + duration * 0.4);
        osc.frequency.exponentialRampToValueAtTime(f3, startTime + duration);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(gainLevel, startTime + duration * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        vibrato.start(startTime);
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
        vibrato.stop(startTime + duration + 0.05);
      };

      // Celestial Chime / Harp Shimmer to accompany the blessing
      const playHeavenlyChime = (startTime: number, freq: number, duration: number, gainLevel = 0.08) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.05);
      };

      // --- SEQUENCE TIMELINE (Total ~4.2 seconds of serene ambient blessing) ---

      // 1. Heavenly golden chimes at the start as God rays appear
      playHeavenlyChime(t0 + 0.05, 587.33, 2.2, 0.08); // D5
      playHeavenlyChime(t0 + 0.15, 880.00, 2.4, 0.06); // A5
      playHeavenlyChime(t0 + 0.28, 1174.66, 2.6, 0.05); // D6

      // 2. Primary reverent dove coos
      playDoveCoo(t0 + 0.2, 0.55, 490, 580, 460, 0.20);
      playDoveCoo(t0 + 0.85, 0.85, 530, 640, 490, 0.24);

      // 3. Cheerful woodland chirping phrases
      playBirdChirp(t0 + 0.5, 2700, 3600, 2900, 0.14, 0.13);
      playBirdChirp(t0 + 0.72, 3100, 4100, 3300, 0.15, 0.15);
      playBirdChirp(t0 + 1.45, 3300, 4500, 3500, 0.12, 0.14);
      playBirdChirp(t0 + 1.62, 3600, 4700, 3800, 0.13, 0.16);
      playBirdChirp(t0 + 1.85, 3200, 4200, 3000, 0.16, 0.14);

      // 4. Secondary gentle distant dove coo
      playDoveCoo(t0 + 2.2, 0.7, 470, 550, 440, 0.18);

      // 5. Delicate farewell chirps as doves settle
      playBirdChirp(t0 + 2.65, 3400, 4300, 3600, 0.11, 0.11);
      playBirdChirp(t0 + 2.82, 3700, 4500, 3900, 0.13, 0.12);

      // Auto-close audio context after soundscape finishes
      setTimeout(() => {
        try {
          ctx.close().catch(() => {});
        } catch {}
      }, 5000);
    } catch (err) {
      console.warn("[WatchdogApproval] Peaceful chirping synthesis note:", err);
    }
  }

  /**
   * Sends desktop notification confirming watchdog approval
   */
  public sendAdminApprovalNotification(data: WatchdogApprovalData): void {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const title = `🕊️ Watchdog Ping Approved • Subsystems Reverent`;
    const body = `Heartbeat #${data.pingCount} Passed (Score ${data.score}/100).\nLatency: ${
      data.latencyMs ? `${data.latencyMs}ms` : "Optimal"
    } | Next 5-minute cycle active.`;

    try {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icon.png",
          badge: "/icon.png",
          tag: `gtc-watchdog-approval-${data.pingCount}`,
          silent: true, // Audio already synthesized harmoniously
        });
      }
    } catch (e) {
      console.warn("[WatchdogApproval] Desktop notification note:", e);
    }
  }
}

export const watchdogApprovalService = new WatchdogApprovalService();
