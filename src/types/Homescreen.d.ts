/**
 * Homescreen API
 *
 * @version v4
 */
type Homescreen = {
  accessories: Accessory[];
  account: {
    amazon_account_linked: Account["amazon_account_linked"];
    email_verification_required: boolean;
    email_verified: boolean;
    id: Account["account_id"];
  };
  app_updates: AppUpdate;
  cameras: Camera[];
  chimes: Chime[];
  device_limits: DeviceLimits;
  doorbell_buttons: DoorbellButton[];
  doorbells: Doorbell[];
  entitlements: Entitlements;
  networks: Network[];
  owls: Owl[];
  sirens: Siren[];
  subscriptions: Subscriptions;
  sync_modules: SyncModule[];
  tiv_lock_enable: boolean;
  tiv_lock_status: TivLockStatus;
  video_stats: VideoStats;
  whats_new: WhatsNew;
};

type Accessory = object;

type AppUpdate = {
  message: string;
  code: number;
  update_available: boolean;
  update_required: boolean;
};

type Entitlements = {
  updated_at: string;
};

type Subscriptions = {
  updated_at: string;
};

type TivLockStatus = {
  locked: boolean;
  expires_at: string;
};

type VideoStats = {
  storage: number;
  auto_delete_days: number;
  auto_delete_day_options: number[];
};

type WhatsNew = {
  updated_at: number;
  url: string;
};
