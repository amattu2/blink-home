"use client";

import { getHomeScreen } from "@/api/actions";
import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { FC, useEffect, useState } from "react";

const Dashboard: FC<AuthHocProps> = ({ account }) => {
  const [homescreen, setHomescreen] = useState<Homescreen | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getHomeScreen();
      if (d.status === "ok") setHomescreen(d.data);
    })();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {JSON.stringify(account)}
      <hr />
      {JSON.stringify(homescreen)}
    </div>
  );
};

export default withAuth(Dashboard, ["LOGGED_IN"]);
