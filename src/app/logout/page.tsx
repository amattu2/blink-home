"use client";

import { Layout } from "antd";
import { FC, useEffect } from "react";
import { logout } from "@/api/actions";
import { useRouter } from "next/navigation";

const Logout: FC = () => {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await logout();
      router.push("/login");
    })();
  }, []);

  return <Layout style={{ height: "100%" }}>Please wait...</Layout>;
};

export default Logout;
