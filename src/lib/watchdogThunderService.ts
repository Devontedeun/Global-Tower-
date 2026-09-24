/**
 * Watchdog Thunder & Screen Vibration Service
 * Provides apostolic thunder audio synthesis, device haptic vibration,
 * dynamic screen tremor/vibration, lightning flash strobe, and OS desktop notifications
 * for Super Admin & Sanctuary Watchdog alerts.
 */

import { WatchdogIncident } from "./backgroundMaintenance";
import { isSuperAdminEmail, isCurrentAdminUser } from "./storage";

export interface ThunderTriggerOptions {
  sound?: boolean;
  haptic?: boolean;
  screenVibrate?: boolean;
  flash?: boolean;
  intensity?: "normal" | "intense" | "apocalyptic";
  incident?: Partial<WatchdogIncident>;
}

const PREF_THUNDER_SOUND = "gtc_watchdog_thunder_sound_enabled";
const PREF_THUNDER_VIBRATE = "gtc_watchdog_thunder_vibrate_enabled";

class WatchdogThunderService {
  private isAudioEnabled: boolean = true;
  private isVibrationEnabled: boolean = true;
  private activeVibrationTimer: any = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        const soundPref = localStorage.getItem(PREF_THUNDER_SOUND);
        if (soundPref !== null) {
          this.isAudioEnabled = soundPref !== "false";
        }
        const vibPref = localStorage.getItem(PREF_THUNDER_VIBRATE);
        if (vibPref !== null) {
          this.isVibrationEnabled = vibPref !== "false";
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
      localStorage.setItem(PREF_THUNDER_SOUND, String(enabled));
    } catch {}
  }

  public isScreenVibrationEnabled(): boolean {
    return this.isVibrationEnabled;
  }

  public setScreenVibrationEnabled(enabled: boolean): void {
    this.isVibrationEnabled = enabled;
    try {
      localStorage.setItem(PREF_THUNDER_VIBRATE, String(enabled));
    } catch {}
  }

  /**
   * Triggers the full thunder experience:
   * 1. Vibrates the visual screen with seismic decaying tremor
   * 2. Fires mobile device haptic vibration
   * 3. Plays acoustic rolling thunder sound via Web Audio API
   * 4. Strobes lightning flash across the screen
   * 5. Sends desktop/OS notification to Admin
   */
  public triggerThunder(options?: ThunderTriggerOptions): void {
    if (typeof window === "undefined") return;

    // STRICT PRIVACY & UX SHIELD:
    // Watchdog thunder, seismic screen vibrations, and lightning alarms are strictly for Admin accounts.
    // They must NEVER fire or interrupt regular users.
    if (!isCurrentAdminUser()) {
      return;
    }

    const sound = options?.sound ?? this.isAudioEnabled;
    const screenVibrate = options?.screenVibrate ?? this.isVibrationEnabled;
    const haptic = options?.haptic ?? this.isVibrationEnabled;
    const flash = options?.flash ?? true;
    const intensity = options?.intensity || "intense";
    const incident = options?.incident;

    console.log("[WatchdogThunder] ⚡ Triggering Apostolic Thunder & Screen Vibration for Admin!", {
      intensity,
      incident: incident?.title
    });

    // 1. Dispatch custom DOM event for React overlays (lightning bolts, shockwave rings)
    window.dispatchEvent(
      new CustomEvent("gtc_watchdog_thunder_event", {
        detail: {
          intensity,
          incident,
          timestamp: Date.now(),
        },
      })
    );

    // 2. Physical Screen Vibration (Adds vibrating class to document body / root)
    if (screenVibrate) {
      this.vibrateScreen(intensity);
    }

    // 3. Mobile Device Haptic Vibration (navigator.vibrate)
    if (haptic) {
      this.vibrateDeviceHaptic(intensity);
    }

    // 4. Web Audio Acoustic Thunder Boom & Rolling Rumble
    if (sound) {
      this.playThunderAudio(intensity);
    }

    // 5. Send Desktop / OS Notification to Admin
    if (incident) {
      this.sendAdminDesktopNotification(incident);
    }
  }

  /**
   * Applies realistic seismic screen tremor directly to the viewport
   */
  public vibrateScreen(intensity: "normal" | "intense" | "apocalyptic" = "intense"): void {
    if (typeof document === "undefined") return;

    const targetEl = document.getElementById("root") || document.body;
    if (!targetEl) return;

    if (this.activeVibrationTimer) {
      clearTimeout(this.activeVibrationTimer);
      targetEl.classList.remove("watchdog-thunder-vibrating", "watchdog-thunder-apocalyptic");
    }

    // Force reflow
    void targetEl.offsetWidth;

    const className = intensity === "apocalyptic" ? "watchdog-thunder-apocalyptic" : "watchdog-thunder-vibrating";
    targetEl.classList.add(className);

    const durationMs = intensity === "apocalyptic" ? 2200 : 1500;
    this.activeVibrationTimer = setTimeout(() => {
      targetEl.classList.remove("watchdog-thunder-vibrating", "watchdog-thunder-apocalyptic");
      this.activeVibrationTimer = null;
    }, durationMs);
  }

  /**
   * Mobile hardware haptic vibration mimicking a crack and rolling thunder rumble
   */
  public vibrateDeviceHaptic(intensity: "normal" | "intense" | "apocalyptic" = "intense"): void {
    if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;

    try {
      // Thunder vibration rhythm: sharp initial strike crack, short silence, rising rolls, deep rumble
      const pattern =
        intensity === "apocalyptic"
          ? [150, 50, 220, 60, 450, 80, 600, 100, 800]
          : [100, 40, 180, 50, 350, 70, 450, 90, 600];

      navigator.vibrate(pattern);
    } catch (e) {
      console.warn("[WatchdogThunder] Haptic vibration note:", e);
    }
  }

  /**
   * Web Audio API Acoustic Thunder Synthesizer
   */
  public playThunderAudio(intensity: "normal" | "intense" | "apocalyptic" = "intense"): void {
    if (typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const sampleRate = ctx.sampleRate;
      const duration = intensity === "apocalyptic" ? 4.2 : 3.5;
      const bufferSize = Math.floor(sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(2, bufferSize, sampleRate);

      const left = noiseBuffer.getChannelData(0);
      const right = noiseBuffer.getChannelData(1);

      let lastOutL = 0.0;
      let lastOutR = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const t = i / sampleRate;

        // Primary lightning strike crack at t=0 to t=0.15s
        const strikeEnvelope = Math.exp(-t * 24);

        // Secondary rolling rumble swells
        const roll1 = Math.exp(-Math.pow((t - 0.4) * 4.5, 2)) * 0.75;
        const roll2 = Math.exp(-Math.pow((t - 1.1) * 3.2, 2)) * 0.9;
        const roll3 = Math.exp(-Math.pow((t - 1.9) * 2.2, 2)) * 0.6;
        const rollTail = Math.exp(-t * 0.85) * 0.45;

        const totalEnvelope = Math.min(1.0, strikeEnvelope * 1.6 + roll1 + roll2 + roll3 + rollTail);

        // Brown noise integration for deep low-end atmospheric roar
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + 0.022 * whiteL) / 1.022;
        lastOutR = (lastOutR + 0.022 * whiteR) / 1.022;

        left[i] = (lastOutL * 3.8 + whiteL * strikeEnvelope * 0.45) * totalEnvelope;
        right[i] = (lastOutR * 3.8 + whiteR * strikeEnvelope * 0.45) * totalEnvelope;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      // Resonant Lowpass filter to shape thunder through the clouds
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.Q.setValueAtTime(4.4, ctx.currentTime);

      // Filter sweep: starts at 980Hz for initial strike crack, drops to 110Hz, rumbles around 65-130Hz
      filter.frequency.setValueAtTime(980, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(115, ctx.currentTime + 0.16);
      filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.55);
      filter.frequency.linearRampToValueAtTime(80, ctx.currentTime + 1.5);
      filter.frequency.linearRampToValueAtTime(45, ctx.currentTime + 3.0);

      // Sub-bass earthquake oscillator for physical subterranean rumble
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(54, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 2.7);

      subGain.gain.setValueAtTime(0.001, ctx.currentTime);
      subGain.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);

      subOsc.connect(subGain);

      // Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.55, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + duration);

      // Connect pipeline
      noiseSource.connect(filter);
      filter.connect(masterGain);
      subGain.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Start nodes
      noiseSource.start(ctx.currentTime);
      subOsc.start(ctx.currentTime);

      noiseSource.stop(ctx.currentTime + duration);
      subOsc.stop(ctx.currentTime + 3.0);

      setTimeout(() => {
        try {
          ctx.close().catch(() => {});
        } catch {}
      }, Math.floor((duration + 0.5) * 1000));
    } catch (err) {
      console.warn("[WatchdogThunder] Audio synthesis note:", err);
    }
  }

  /**
   * Request Notification Permission from Browser / OS
   */
  public async requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return "unsupported";
    }

    try {
      const perm = await Notification.requestPermission();
      console.log(`[WatchdogThunder] Notification permission result: ${perm}`);
      return perm;
    } catch (e) {
      console.warn("[WatchdogThunder] Notification request permission error:", e);
      return "denied";
    }
  }

  /**
   * Sends a high-priority desktop / system push notification to the Admin
   */
  public sendAdminDesktopNotification(incident: Partial<WatchdogIncident>): void {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const title = `⚡ Watchdog Alert: ${incident.title || "Sanctuary Anomaly Detected"}`;
    const body = `${incident.problem || "Subsystem anomaly monitored."}\nWatchdog Action: ${
      incident.remedyActionTaken || "Self-healing in progress."
    }`;

    try {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body,
          icon: "/icon.png",
          badge: "/icon.png",
          tag: `gtc-watchdog-${incident.id || Date.now()}`,
          requireInteraction: true,
        });
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification(title, {
              body,
              icon: "/icon.png",
              badge: "/icon.png",
              tag: `gtc-watchdog-${incident.id || Date.now()}`,
              requireInteraction: true,
            });
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.warn("[WatchdogThunder] Desktop notification dispatch note:", err);
    }
  }
}

export const watchdogThunderService = new WatchdogThunderService();
