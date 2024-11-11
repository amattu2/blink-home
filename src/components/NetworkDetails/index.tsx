import { Descriptions, DescriptionsProps } from "antd";
import { FC } from "react";

type Props = {
  network: Network;
  sync_module: SyncModule;
};

const NetworkDetails: FC<Props> = ({ network, sync_module }) => {
  const items: DescriptionsProps["items"] = [
    {
      label: "Status",
      key: "status",
      children: (
        <p style={{ textTransform: "capitalize" }}>
          {sync_module?.status || "Offline"}
        </p>
      ),
    },
    {
      label: "Armed",
      key: "armed",
      children: network.armed ? "Armed" : "Disarmed",
    },
    {
      label: "Timezone",
      key: "time_zone",
      children: network.time_zone,
    },
    {
      label: "Live View",
      key: "lv_save",
      children: network.lv_save ? "Enabled" : "Disabled",
    },
  ];

  return (
    <Descriptions
      title={`${network.name} Network`}
      layout="vertical"
      column={4}
      items={items}
      bordered
    />
  );
};

export default NetworkDetails;
