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
} & T;

type LoginApiResponse = {
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
