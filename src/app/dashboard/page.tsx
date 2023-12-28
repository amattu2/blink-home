"use client";

import { getHomeScreen } from "@/api/actions";
import VisionDeviceCard from "@/components/VisionDeviceCard";
import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { FC, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { aggregateVisionDevices } from "@/utils/dashboard";

const Dashboard: FC<AuthHocProps> = ({ account }) => {
  const [homescreen, setHomescreen] = useLocalStorage<Homescreen | null>(
    STORAGE_KEYS.homescreen,
    null,
  );

  useEffect(() => {
    if (homescreen) {
      return;
    }

    (async () => {
      const d = await getHomeScreen();
      if (d.status === "ok") setHomescreen(d.data);
    })();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {account?.account_id}
      {homescreen?.networks.map((network) => (
        <div key={network.id}>
          <h2>
            {network.name} - {network.armed ? "armed" : "disarmed"}
          </h2>
          <div>
            {aggregateVisionDevices(network.id, homescreen).map((device) => (
              <VisionDeviceCard key={device.id} device={device} />
            ))}
          </div>
          <div>
            {homescreen.sync_modules
              .filter((m) => m.network_id === network.id)
              .map((module) => (
                <div key={module.id}>
                  <p>Module {module.serial}</p>
                  <p>{module.status}</p>
                </div>
              ))}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default withAuth(Dashboard, ["LOGGED_IN"]);
