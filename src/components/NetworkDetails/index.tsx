import { Descriptions, DescriptionsProps } from "antd";
import { FC } from "react";

type Props = {
  network: Network;
};

const NetworkDetails: FC<Props> = ({ network }) => {
  const items: DescriptionsProps["items"] = [
    {
      label: "ID",
      key: "id",
      children: network.id,
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
      items={items}
      bordered
    />
  );
};

export default NetworkDetails;
