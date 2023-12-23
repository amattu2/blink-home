type LoginBody = {
  /**
   * The email of the account
   */
  email: string;
  /**
   * The password of the account
   */
  password: string;
  /**
   * Unique identifier tied to the current device
   */
  unique_Id?: string;
  /**
   * The type of client
   *
   * @TODO scope out whether iOS is an option
   */
  client_type?: ClientType;
  /**
   * Friendly name of the client
   *
   * Used for the device overview page. Strongly recommend.
   */
  client_name?: string;
  /**
   * The breakdown of the device information
   *
   * @example Manufacterer Model, Brand/Device
   * @example Google Pixel 7 Pro, google/raven
   */
  device_identifier?: string;
  /**
   * The OS build version of the client
   *
   * @example 14.0
   */
  os_version?: string;
  /**
   * Reauthenticating the device
   *
   * True if the device has logged in before and the `unique_Id` is the same
   *
   * @default false
   */
  reauth?: boolean;
};

type ClientType = "amazon" | "android";

/**
 * @version v5
 */
type LoginResponse = {
  account: Account;
  allow_pin_resend_seconds: number;
  auth: LoginAuth;
  force_password_reset: boolean;
  lockout_time_remaining: number;
  phone: AccountPhone;
  verification: LoginVerification;
};

type LoginAuth = {
  token: string;
};

type LoginVerification = {
  email: {
    required: boolean;
  };
  phone: {
    required: boolean;
    channel: "sms" | "voice";
  };
};

type LoginFailure = Pick<
  LoginResponse,
  "allow_pin_resend_seconds" | "lockout_time_remaining"
> & {
  message: string;
};

type VerifyLoginResponse = {
  TODO: string;
};
