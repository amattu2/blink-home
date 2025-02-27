type AuthState = "LOGGED_IN" | "LOGGED_OUT" | "TWO_FACTOR";

type AuthSession = {
  state: AuthState;
  client_id: string;
  reauth: boolean;
  account: Account | null;
  token: string | null;
};

type BaseResponse = {
  status: "ok" | "error";
};

type ApiSuccess<T> = BaseResponse & {
  status: "ok";
} & T;

type ApiError<T> = BaseResponse & {
  status: "error";
  message: string;
} & Partial<T>;

type LoginApiBody = {
  email: string;
  password: string;
  unique_id?: string;
  client_type?: "amazon" | "android";
  client_name?: string;
  device_identifier?: string;
  os_version?: string;
  reauth?: boolean;
};

type RegisterApiBody = {
  password_confirm: string;
  country: string;
} & LoginApiBody;

type LoginApiResponse = {
  two_factor_auth: boolean;
};

type RegisterApiResponse = {
  // TODO: more?
  two_factor_auth: boolean;
};

type TwoFactorApiResponse = {
  status: BaseResponse["status"];
};

type LogoutApiResponse = {
  status: BaseResponse["status"];
};

type GetAccountApiResponse = {
  account: Account | null;
  state: AuthState;
};

type GetHomeScreenApiResponse = {
  data: Homescreen | null;
};

type GetCountriesApiResponse = {
  countries: string[];
};

type GetMediaApiResponse = {
  media: MediaEvent[];
};

type CommandApiInitiateBody = {
  id: number;
  network_id: number;
  // TODO: Add more
  command: "thumbnail";
  // TODO: Add more states
  state: "new";
  /**
   * The response message, present for failed commands
   */
  message?: string;
};

type CommandStatusBody = {
  complete: boolean;
  /**
   * The status of the command
   *
   * 0 - Success
   */
  status: number;
  status_message: string;
  status_code: string;
  commands: object[];
};
