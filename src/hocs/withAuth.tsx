"use client";

import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import { getAuthState, getRedirectPath } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

export type AuthHocProps = {
  account: Account;
  token: LoginAuth["token"];
  setAccount: (account: Partial<Account>) => void;
  handleLogout: () => void;
};

const withAuth = (
  WrappedComponent: FC<AuthHocProps>,
  permissible: AuthState[],
) => {
  const WithAuthComponent: FC = (props) => {
    const router = useRouter();
    const [token, setToken] = useLocalStorage<string>(
      STORAGE_KEYS.USER_TOKEN,
      "",
    );
    const [account, setAccount] = useLocalStorage<Account>(
      STORAGE_KEYS.USER_ACCOUNT,
      {} as Account,
    );
    const loginState = useMemo(
      () => getAuthState(account, token),
      [account, token],
    );

    const handleSetAccount = (newAccount: Partial<Account>) => {
      setAccount({ ...account, ...newAccount });
    };

    const handleLogout = () => {
      setAccount({} as Account);
      setToken("");
    };

    if (loginState === "LOGGED_OUT" || !permissible.includes(loginState)) {
      router.push(getRedirectPath(loginState));
      return <div>Redirecting...</div>;
    }

    return (
      <WrappedComponent
        {...props}
        account={account}
        token={token}
        setAccount={handleSetAccount}
        handleLogout={handleLogout}
      />
    );
  };

  return WithAuthComponent;
};

export default withAuth;
