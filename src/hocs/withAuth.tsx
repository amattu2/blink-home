"use client";

import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import { useRouter } from "next/navigation";
import { useEffect, FC } from "react";
import { useLocalStorage } from "usehooks-ts";

export type AuthProps = {
  account: Account;
  token: LoginAuth["token"];
};

export type AuthState = "LOGGED_IN" | "LOGGED_OUT" | "TWO_FACTOR";

const withAuth = (
  WrappedComponent: FC<AuthProps>,
  permissible: AuthState[],
) => {
  const WithAuthComponent: FC = (props) => {
    const router = useRouter();
    const [account] = useLocalStorage<Account>(
      STORAGE_KEYS.USER_ACCOUNT,
      {} as Account,
    );
    const [loginState] = useLocalStorage<AuthState>(
      STORAGE_KEYS.LOGIN_STATE,
      "LOGGED_OUT",
    );
    const [token] = useLocalStorage<string>(STORAGE_KEYS.USER_TOKEN, "");

    useEffect(() => {
      if (permissible.includes(loginState)) {
        return;
      }
      if (loginState === "LOGGED_OUT") {
        router.push("/login");
      } else if (loginState === "TWO_FACTOR") {
        router.push("/2fa");
      }
    }, [loginState]);

    if (!account || !token || loginState === "LOGGED_OUT") {
      return <div>Loading</div>;
    }

    if (permissible.includes(loginState)) {
      return <WrappedComponent {...props} account={account} token={token} />;
    }

    return <div>Something went wrong</div>;
  };

  return WithAuthComponent;
};

export default withAuth;
