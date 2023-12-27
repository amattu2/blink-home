type AuthState = "LOGGED_IN" | "LOGGED_OUT" | "TWO_FACTOR";

type AuthSession = {
  state: AuthState;
  client_id: string;
  reauth: boolean;
  account: Account | null;
  token: string | null;
};
