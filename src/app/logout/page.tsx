"use client";

import { Layout } from "antd";
import { FC, useEffect } from "react";
import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { logout } from "@/api/actions";

const Logout: FC<AuthHocProps> = ({ account, token, handleLogout }) => {
  useEffect(() => {
    (async () => {
      const r = await logout(account, token);
      if (r.status === "ok") {
        handleLogout();
      }
    })();
  }, []);

  return <Layout style={{ height: "100%" }}>Please wait...</Layout>;
};

export default withAuth(Logout, ["LOGGED_IN"]);
