type DeviceType =
  | "camera"
  | "doorbell"
  | "lotus"
  | "chime"
  | "doorbell_button"
  | "sm"
  | "sm2"
  | "siren"
  | "owl"
  | "superior";

/**
 * Blink devices that are vision-based
 *
 * Lotus: Doorbell
 * Owl: Indoor Camera
 * Superior: Floodlight
 */
type VisionDeviceType = "lotus" | "owl" | "superior";

/**
 * Defines a base model for all Blink devices.
 */
type BaseDevice<T> = {
  created_at: string;
  fw_version: string;
  id: number;
  local_storage_compatibile: boolean;
  local_storage_enabled: boolean;
  name: string;
  network_id: number;
  onboarded: boolean;
  revision: string;
  status: "done" | "online";
  type: DeviceType;
  updated_at: string;
} & T;

/**
 * Defines a base model for all Blink Vision devices.
 *
 * e.g. Doorbell, Owl, Floodlight
 */
type BaseVisionDevice<T> = Omit<BaseDevice<T>, "type"> & {
  thumbnail: string;
  type: VisionDeviceType;
};

type Doorbell = BaseVisionDevice<{
  battery: "ok";
  changing_mode: boolean;
  color: "black" | "white";
  config_out_of_sync: boolean;
  doorbell_mode: "lfr";
  enabled: boolean;
  issues: object[];
  serial_number: string;
  signals: DeviceSignals;
  snooze: boolean;
  snooze_time_remaining: number | null;
  type: "doorbell";
}>;

type Owl = BaseVisionDevice<{
  color: "black" | "white";
  enabled: boolean;
  serial_number: string;
  snooze: boolean;
  snooze_time_remaining: number | null;
  type: "owl";
}>;

type SyncModule = BaseDevice<{
  enabled_temp_alerts: boolean;
  last_hb: string;
  local_storage_status: "active";
  serial: string;
  type: "sm2" | "sm";
  subtype: "billy";
  wifi_strength: number;
}>;

type Camera = BaseDevice<object>;

type Chime = BaseDevice<object>;

type DoorbellButton = BaseDevice<object>;

type DeviceSignals = {
  lfr: number;
  wifi: number;
  battery: number;
};

type DeviceLimits = {
  camera: number;
  chime: number;
  doorbell: number;
  doorbell_button: number;
  owl: number;
  siren: number;
  total_devices: number;
};
