type Camera = object;

type Chime = object;

type DeviceLimits = {
  camera: number;
  chime: number;
  doorbell: number;
  doorbell_button: number;
  owl: number;
  siren: number;
  total_devices: number;
};

type DoorbellButton = object;

type Doorbell = {
  battery: "ok";
  changing_mode: boolean;
  color: "black" | "white";
  config_out_of_sync: boolean;
  created_at: string;
  doorbell_mode: "lfr";
  enabled: boolean;
  fw_version: string;
  id: string;
  issues: object[];
  local_storage_compatibile: boolean;
  local_storage_enabled: boolean;
  name: string;
  network_id: number;
  onboarded: boolean;
  revision: string;
  serial_number: string;
  signals: DeviceSignals;
  snooze: boolean;
  snooze_time_remaining: number | null;
  status: "done";
  thumbnail: string;
  type: "lotus";
  update_at: string;
};

type DeviceSignals = {
  lfr: number;
  wifi: number;
  battery: number;
};

type Owl = {
  color: "black" | "white";
  created_at: string;
  enabled: boolean;
  fw_version: string;
  id: string;
  local_storage_compatibile: boolean;
  local_storage_enabled: boolean;
  name: string;
  network_id: number;
  onboarded: boolean;
  revision: string;
  serial_number: string;
  snooze: boolean;
  snooze_time_remaining: number | null;
  status: "done";
  thumbnail: string;
  type: "owl";
  update_at: string;
};

type SyncModule = {
  created_at: string;
  enabled_temp_alerts: boolean;
  fw_version: string;
  id: string;
  last_hb: string;
  local_storage_compatibile: boolean;
  local_storage_enabled: boolean;
  local_storage_status: "active";
  name: string;
  network_id: number;
  onboarded: boolean;
  revision: string;
  serial: string;
  status: "online";
  type: "sm2" | "sm";
  subtype: "billy";
  update_at: string;
  wifi_strength: number;
};
