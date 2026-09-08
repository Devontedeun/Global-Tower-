// Bluetooth and Audio Output Routing Service
// Automatically detects connected Bluetooth headphones / speakers,
// routes HTMLMediaElement and app audio, and gracefully falls back to device speakers.

export interface AudioOutputDevice {
  deviceId: string;
  label: string;
  isBluetooth: boolean;
  groupId?: string;
}

type AudioDeviceChangeListener = (devices: AudioOutputDevice[], activeDevice: AudioOutputDevice | null) => void;

class BluetoothAudioService {
  private activeDeviceId: string = "default";
  private activeDeviceLabel: string = "Device Speaker";
  private isBluetoothActive: boolean = false;
  private registeredMediaElements: Set<HTMLMediaElement> = new Set();
  private listeners: Set<AudioDeviceChangeListener> = new Set();
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.init();
    }
  }

  public init() {
    if (this.initialized || typeof window === "undefined" || !navigator.mediaDevices) return;
    this.initialized = true;

    // Listen to hardware/bluetooth device connect and disconnect events
    try {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        this.scanAndRouteDevices(true);
      });
    } catch (e) {
      console.warn("devicechange listener not supported:", e);
    }

    // Initial scan
    this.scanAndRouteDevices(false);
  }

  public isSinkIdSupported(): boolean {
    return typeof HTMLMediaElement !== "undefined" && "setSinkId" in HTMLMediaElement.prototype;
  }

  public isBluetoothConnected(): boolean {
    return this.isBluetoothActive;
  }

  public getActiveDevice(): AudioOutputDevice {
    return {
      deviceId: this.activeDeviceId,
      label: this.activeDeviceLabel,
      isBluetooth: this.isBluetoothActive,
      groupId: ""
    };
  }

  public registerMediaElement(el: HTMLMediaElement | null) {
    if (!el) return;
    this.registeredMediaElements.add(el);
    if (this.isSinkIdSupported() && this.activeDeviceId && this.activeDeviceId !== "default") {
      try {
        (el as any).setSinkId(this.activeDeviceId).catch((err: any) => {
          console.warn("Could not set sink ID on registered media element:", err);
        });
      } catch (e) {
        // graceful ignore
      }
    }
  }

  public unregisterMediaElement(el: HTMLMediaElement | null) {
    if (!el) return;
    this.registeredMediaElements.delete(el);
  }

  public async getAvailableOutputDevices(): Promise<AudioOutputDevice[]> {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputs = devices.filter((d) => d.kind === "audiooutput");

      return outputs.map((d, index) => {
        const label = d.label || `Audio Output ${index + 1}`;
        const isBt = /bluetooth|headset|airpods|buds|wireless|headphones|earphones|handsfree|bt\b/i.test(label);
        return {
          deviceId: d.deviceId,
          label: label,
          isBluetooth: isBt,
          groupId: d.groupId
        };
      });
    } catch (err) {
      console.warn("Error enumerating audio outputs:", err);
      return [];
    }
  }

  public async scanAndRouteDevices(notifyChange: boolean = false) {
    const devices = await this.getAvailableOutputDevices();
    const bluetoothDevice = devices.find((d) => d.isBluetooth);

    if (bluetoothDevice) {
      // Bluetooth device detected! Auto-route to it
      if (this.activeDeviceId !== bluetoothDevice.deviceId) {
        await this.routeToDevice(bluetoothDevice.deviceId, bluetoothDevice.label, true);
      }
    } else {
      // No bluetooth device connected; if we were on bluetooth, gracefully fall back to default speaker
      if (this.isBluetoothActive) {
        await this.routeToDevice("default", "Default Device Speaker", false);
      }
    }

    if (notifyChange) {
      this.notifyListeners(devices);
    }
  }

  public async routeToDevice(deviceId: string, label?: string, isBluetooth?: boolean): Promise<boolean> {
    this.activeDeviceId = deviceId;
    this.activeDeviceLabel = label || (deviceId === "default" ? "Device Speaker" : "Audio Device");
    this.isBluetoothActive = isBluetooth ?? /bluetooth|headset|airpods|buds|wireless/i.test(this.activeDeviceLabel);

    if (this.isSinkIdSupported()) {
      const sinkId = deviceId === "default" ? "" : deviceId;
      for (const el of this.registeredMediaElements) {
        try {
          await (el as any).setSinkId(sinkId);
        } catch (err) {
          console.warn("setSinkId failed on element:", err);
        }
      }
    }

    const devices = await this.getAvailableOutputDevices();
    this.notifyListeners(devices);
    return true;
  }

  public subscribe(listener: AudioDeviceChangeListener): () => void {
    this.listeners.add(listener);
    this.getAvailableOutputDevices().then((devices) => {
      listener(devices, this.getActiveDevice());
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(devices: AudioOutputDevice[]) {
    const active = this.getActiveDevice();
    for (const listener of this.listeners) {
      try {
        listener(devices, active);
      } catch (err) {
        console.error("Audio listener error:", err);
      }
    }
  }
}

export const bluetoothAudioService = new BluetoothAudioService();
