"use client";

import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { getAccount } from "@/api/actions";
import { getRedirectPath } from "@/utils/auth";
import { Spin } from "antd";

export type AuthHocProps = {
  account: Account;
};

/**
 * Hydrates the wrapped component with the account object.
 * and redirects to the appropriate page if the user is not
 * in the permissible state.
 *
 * @see AuthHocProps The props that will be passed to the wrapped component.
 * @param WrappedComponent The component to be wrapped.
 * @param permissible The permissible states.
 */
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
        if (!state || !permissible.includes(state) || !account) {
          router.push(getRedirectPath(state));
          return;
        }

        setAccount(account);
        setLoading(false);
      })();
    }, []);

    return loading || !account ? (
      <Spin fullscreen spinning />
    ) : (
      <WrappedComponent {...props} account={account} />
    );
  };

  return WithAuthComponent;
};

export default withAuth;
