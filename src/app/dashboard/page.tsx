"use client";

import { getHomeScreen } from "@/api/actions";
import VisionDeviceCard from "@/components/VisionDeviceCard";
import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { FC, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { aggregateVisionDevices } from "@/utils/dashboard";
import { Layout, Breadcrumb, Row, Col } from "antd";
import NetworkDetails from "@/components/NetworkDetails";

const { Footer, Content } = Layout;

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
    <Content>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Blink Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: "#fff",
            padding: "2px 24px",
            borderRadius: "8px",
          }}
        >
          <h1>Dashboard</h1>
          {account?.account_id}
          {homescreen?.networks.map((network) => (
            <div key={network.id}>
              <NetworkDetails network={network} />
              <Row gutter={[16, 16]}>
                {aggregateVisionDevices(network.id, homescreen).map(
                  (device) => (
                    <Col key={device.id}>
                      <VisionDeviceCard device={device} />
                    </Col>
                  ),
                )}
              </Row>
              <Row gutter={[16, 16]}>
                {homescreen.sync_modules
                  .filter((m) => m.network_id === network.id)
                  .map((module) => (
                    <Col key={module.id}>
                      <p>Module {module.serial}</p>
                      <p>{module.status}</p>
                    </Col>
                  ))}
              </Row>
              <hr />
            </div>
          ))}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        ©{new Date().getFullYear()} Created by{" "}
        <a href="https://amattu.com">amattu.com</a>
      </Footer>
    </Content>
  );
};

export default withAuth(Dashboard, ["LOGGED_IN"]);
