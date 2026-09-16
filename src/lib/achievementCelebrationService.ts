import { Achievement, ACHIEVEMENTS_LIST, calculateAchievementsSummary } from "../data/achievementsData";
import { Storage } from "./storage";

const STORAGE_KEY_SEEN_ACHIEVEMENTS = "gtc_celebrated_achievements_v1";

export interface AchievementCelebrationEvent {
  achievement: Achievement;
  isFirstUnlock: boolean;
  timestamp: number;
}

class AchievementCelebrationService {
  private celebratedSet: Set<string> = new Set();
  private isSoundMuted: boolean = false;
  private hasInitialized: boolean = false;

  constructor() {
    this.loadCelebratedSet();
  }

  private loadCelebratedSet() {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SEEN_ACHIEVEMENTS);
      if (raw) {
        const list: string[] = JSON.parse(raw);
        this.celebratedSet = new Set(list);
      }
    } catch {
      this.celebratedSet = new Set();
    }
  }

  private persistCelebratedSet() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY_SEEN_ACHIEVEMENTS, JSON.stringify(Array.from(this.celebratedSet)));
    } catch {}
  }

  public isMuted(): boolean {
    return this.isSoundMuted;
  }

  public setMuted(muted: boolean): void {
    this.isSoundMuted = muted;
  }

  /**
   * Initializes baseline achievements on first app load so we don't bombard
   * the user with 5 historical achievements at the very first second of opening,
   * but will celebrate any subsequent achievements earned.
   */
  public initializeBaseline(): void {
    if (this.hasInitialized || typeof window === "undefined") return;
    this.hasInitialized = true;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_SEEN_ACHIEVEMENTS);
      if (!raw) {
        // First session: mark existing unlocked items as already known
        const metrics = Storage.getSpiritualMetrics();
        const summary = calculateAchievementsSummary(metrics, true);
        summary.results.forEach((r) => {
          if (r.isUnlocked) {
            this.celebratedSet.add(r.achievement.id);
          }
        });
        this.persistCelebratedSet();
      }
    } catch (e) {
      console.warn("[AchievementService] Baseline init note:", e);
    }
  }

  /**
   * Checks current spiritual metrics and triggers celebration for any newly unlocked achievement!
   */
  public checkAndCelebrateNewAchievements(isRegisteredUser = true): Achievement[] {
    if (typeof window === "undefined") return [];

    try {
      const metrics = Storage.getSpiritualMetrics();
      const summary = calculateAchievementsSummary(metrics, isRegisteredUser);
      const newlyEarned: Achievement[] = [];

      for (const res of summary.results) {
        if (res.isUnlocked && !this.celebratedSet.has(res.achievement.id)) {
          this.celebratedSet.add(res.achievement.id);
          newlyEarned.push(res.achievement);
        }
      }

      if (newlyEarned.length > 0) {
        this.persistCelebratedSet();
        // Trigger celebration for the first newly earned achievement
        this.triggerCelebration(newlyEarned[0], true);
      }

      return newlyEarned;
    } catch (e) {
      console.warn("[AchievementService] Check error:", e);
      return [];
    }
  }

  /**
   * Triggers the full Achievement Celebration:
   * 1. Heavenly soundscape (Web Audio API)
   * 2. Visual 3D rotating achievement badge on central axis for exactly 3 seconds
   * 3. Dispatches custom DOM event for React Celebration Overlay
   */
  public triggerCelebration(achievement: Achievement, isFirstUnlock = false): void {
    if (typeof window === "undefined") return;

    console.log(`[AchievementCelebration] 🏆 Celebrating achievement: ${achievement.title}`);

    // 1. Play heavenly angelic sound
    if (!this.isSoundMuted) {
      this.playHeavenlySound();
    }

    // 2. Dispatch custom event for visual modal / toast
    const detail: AchievementCelebrationEvent = {
      achievement,
      isFirstUnlock,
      timestamp: Date.now(),
    };

    window.dispatchEvent(
      new CustomEvent("gtc_achievement_unlocked", {
        detail,
      })
    );
  }

  /**
   * Pure Web Audio API Heavenly Sound Synthesizer:
   * Creates a magnificent, transcendent celestial chord progression with:
   * - Gentle celestial harp glissando sweeping upwards
   * - Transcendent choir / organ pad with rich harmonic overtones
   * - Divine glass chime ping at the 3-second lock mark
   */
  public playHeavenlySound(): void {
    if (typeof window === "undefined") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      const t0 = ctx.currentTime;

      // Master compressor & limiter to ensure pristine, distortion-free celestial sound
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-18, t0);
      compressor.knee.setValueAtTime(30, t0);
      compressor.ratio.setValueAtTime(8, t0);
      compressor.attack.setValueAtTime(0.003, t0);
      compressor.release.setValueAtTime(0.25, t0);
      compressor.connect(ctx.destination);

      // Helper: Resonant Celestial Bell / Chime Voice
      const playCelestialBell = (startTime: number, freq: number, duration: number, gainLevel = 0.12) => {
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        // Harmonic shimmer 2 octaves up
        oscHarmonic.type = "triangle";
        oscHarmonic.frequency.setValueAtTime(freq * 2.01, startTime);

        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq * 1.5, startTime);
        filter.Q.setValueAtTime(2.5, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        oscHarmonic.connect(gain);
        gain.connect(filter);
        filter.connect(compressor);

        osc.start(startTime);
        oscHarmonic.start(startTime);
        osc.stop(startTime + duration + 0.05);
        oscHarmonic.stop(startTime + duration + 0.05);
      };

      // Helper: Angelic Warm Choir / Pad Chord Note
      const playPadVoice = (startTime: number, freq: number, duration: number, maxGain = 0.08) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(freq, startTime);

        // Detuned sister oscillator creates lush angelic chorus warmth
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 1.004, startTime);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, startTime);
        filter.frequency.exponentialRampToValueAtTime(2200, startTime + duration * 0.4);
        filter.frequency.exponentialRampToValueAtTime(800, startTime + duration);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.6); // Soft heavenly swell
        gain.gain.setValueAtTime(maxGain, startTime + duration * 0.65);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(compressor);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + duration + 0.05);
        osc2.stop(startTime + duration + 0.05);
      };

      // 1. CELESTIAL HARP GLISSANDO (Ascending holy frequencies)
      // Notes in F Major 9 / C Major (Majestic, radiant, uplifting)
      const harpNotes = [
        { f: 261.63, d: 0.00 }, // C4
        { f: 329.63, d: 0.08 }, // E4
        { f: 392.00, d: 0.16 }, // G4
        { f: 493.88, d: 0.24 }, // B4
        { f: 523.25, d: 0.32 }, // C5
        { f: 659.25, d: 0.40 }, // E5
        { f: 783.99, d: 0.48 }, // G5
        { f: 987.77, d: 0.56 }, // B5
        { f: 1046.50, d: 0.64 }, // C6
        { f: 1318.51, d: 0.74 }, // E6
      ];

      harpNotes.forEach((n) => {
        playCelestialBell(t0 + n.d, n.f, 2.2, 0.11);
      });

      // 2. ANGELIC CHOIR SWELL (Spans the 3 seconds of rotation)
      // Root C major with 9th and 6th: C3, G3, C4, E4, G4, D5
      playPadVoice(t0 + 0.1, 130.81, 3.8, 0.10); // C3
      playPadVoice(t0 + 0.15, 196.00, 3.8, 0.09); // G3
      playPadVoice(t0 + 0.2, 261.63, 3.8, 0.08); // C4
      playPadVoice(t0 + 0.25, 329.63, 3.8, 0.07); // E4
      playPadVoice(t0 + 0.3, 392.00, 3.8, 0.07); // G4
      playPadVoice(t0 + 0.35, 587.33, 3.8, 0.05); // D5

      // 3. THE 3-SECOND HALT APOTHEOSIS (At t0 + 3.0s when rotation locks into place!)
      // A radiant high crystalline chime confirming the achievement is settled and glorified!
      const lockTime = t0 + 3.0;
      playCelestialBell(lockTime, 1046.50, 2.5, 0.18); // C6
      playCelestialBell(lockTime + 0.06, 1318.51, 2.8, 0.16); // E6
      playCelestialBell(lockTime + 0.12, 1567.98, 3.0, 0.15); // G6
      playCelestialBell(lockTime + 0.18, 2093.00, 3.2, 0.12); // C7 (High shimmering star)

      // Auto cleanup AudioContext
      setTimeout(() => {
        try {
          ctx.close().catch(() => {});
        } catch {}
      }, 6500);
    } catch (err) {
      console.warn("[AchievementService] Web Audio heavenly sound note:", err);
    }
  }

  /**
   * Resets celebrated achievements cache for testing
   */
  public resetCelebratedCache(): void {
    this.celebratedSet.clear();
    try {
      localStorage.removeItem(STORAGE_KEY_SEEN_ACHIEVEMENTS);
    } catch {}
  }
}

export const achievementCelebrationService = new AchievementCelebrationService();
