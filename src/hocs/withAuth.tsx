"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { getAccount } from "@/api/actions";
import { getRedirectPath } from "@/utils/auth";

export type AuthHocProps = {
  account: Account;
};

const withAuth = (
  WrappedComponent: FC<AuthHocProps>,
  permissible: AuthState[],
) => {
  const WithAuthComponent: FC = (props) => {
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [account, setAccount] = useState<Account | null>(null);

    useEffect(() => {
      (async () => {
        const { state, account } = await getAccount();
        if (!permissible.includes(state)) {
          router.push(getRedirectPath(state));
          return;
        }

        setAccount(account);
        setLoading(false);
      })();
    }, []);

    return loading || !account ? (
      <p>Loading...</p>
    ) : (
      <WrappedComponent {...props} account={account} />
    );
  };

  return WithAuthComponent;
};

export default withAuth;
