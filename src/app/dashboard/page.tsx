"use client";

import { getHomeScreen } from "@/api/actions";
import VisionDeviceCard, {
  VisionCardMethods,
} from "@/components/VisionDeviceCard";
import { STORAGE_KEYS } from "@/config/STORAGE_KEYS";
import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { FC, useEffect, useRef } from "react";
import { useLocalStorage } from "usehooks-ts";
import { aggregateVisionDevices } from "@/utils/dashboard";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  List,
  Typography,
  Card,
  Button,
} from "antd";
import NetworkDetails from "@/components/NetworkDetails";
import Statistics from "@/components/Statistics";
import Section from "@/components/Section";
import MediaEventList from "@/components/MediaEventList";

const Dashboard: FC<AuthHocProps> = () => {
  const [homescreen, setHomescreen] = useLocalStorage<Homescreen | null>(
    STORAGE_KEYS.homescreen,
    null,
  );
  const thumbnailRefs = useRef<Array<VisionCardMethods>>([]);

  const refreshThumbnails = () => {
    // TODO: await refreshThumbnail for each device
    // thumbnailRefs?.current.forEach((ref) => ref?.refreshThumbnail());
  };

  useEffect(() => {
    (async () => {
      const d = await getHomeScreen();
      if (d.status === "ok") {
        setHomescreen(d.data);
      }
    })();
  }, []);

  if (!homescreen) {
    return null;
  }

  return (
    <Layout.Content style={{ padding: "8px 32px" }}>
      <Section>
        {/* Componentize the page header */}
        <Breadcrumb style={{ marginTop: "16px" }}>
          <Breadcrumb.Item>Blink Home</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <Typography.Title level={2}>Dashboard</Typography.Title>
      </Section>
      <Row gutter={16}>
        <Col span={16}>
          <Section>
            <Statistics home={homescreen} />
          </Section>
          <Section>
            {homescreen?.networks.map((network, index) => (
              <Card
                key={network.id}
                style={{
                  marginBottom:
                    index !== homescreen.networks.length - 1 ? 16 : 0,
                }}
              >
                <NetworkDetails network={network} />
                {/* TODO: move to sidepanel, this is for testing */}
                <Button onClick={refreshThumbnails}>
                  Refresh All Thumbnails
                </Button>
                <List
                  grid={{ gutter: 16, lg: 2, md: 1, sm: 1, xs: 1 }}
                  dataSource={aggregateVisionDevices(network.id, homescreen)}
                  renderItem={(item, idx) => (
                    <List.Item>
                      <VisionDeviceCard
                        device={item}
                        ref={(e: VisionCardMethods) => {
                          thumbnailRefs.current[idx] = e;
                        }}
                      />
                    </List.Item>
                  )}
                />
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
              </Card>
            ))}
          </Section>
        </Col>
        <Col span={8}>
          <Section>
            <Card title="Networks">
              networks as a list
              <p>...</p>
              <p>...</p>
            </Card>
          </Section>
          <Section>
            <Card title="Events" bodyStyle={{ padding: 0 }}>
              <MediaEventList />
            </Card>
          </Section>
        </Col>
      </Row>
      <Layout.Footer style={{ textAlign: "center" }}>
        ©{new Date().getFullYear()} Created by{" "}
        <a href="https://amattu.com">amattu.com</a>
      </Layout.Footer>
    </Layout.Content>
  );
};

export default withAuth(Dashboard, ["LOGGED_IN"]);
