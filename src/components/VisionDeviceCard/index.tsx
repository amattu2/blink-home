import { FC } from "react";
import { Card, Popconfirm, Tag } from "antd";
import { EditOutlined, CloudSyncOutlined } from "@ant-design/icons";
import Thumbnail from "@/components/Thumbnail";

const { Meta } = Card;

type Props<T extends BaseVisionDevice<unknown>> = {
  device: T;
};

/**
 * Builds a Dashboard card for a Blink vision-enabled device.
 *
 * @param {Props<BaseVisionDevice<unknown>>} { device }
 * @returns {React.FC}
 */
const VisionDeviceCard: FC<Props<BaseVisionDevice<unknown>>> = ({ device }) => {
  const { name, thumbnail, updated_at, type, id } = device;

  const refreshThumbnail = async () => {
    // TODO: Implement this
  };

  return (
    <Card
      style={{ width: 560 }}
      cover={<Thumbnail src={thumbnail} alt={name} width={560} height={315} />}
      actions={[
        <Popconfirm
          key="sync"
          title="Refresh thumbnail?"
          description="Are you sure to refresh this thumbnail?"
          onConfirm={refreshThumbnail}
          okText="Yes"
          cancelText="No"
        >
          <CloudSyncOutlined key="setting" />
        </Popconfirm>,
        <EditOutlined key="edit" />,
      ]}
    >
      <Meta
        title={name}
        description={
          <>
            <p>Last updated at {updated_at}</p>
            <Tag>{type}</Tag>
            <Tag>#{id}</Tag>
          </>
        }
      />
    </Card>
  );
};

export default VisionDeviceCard;
