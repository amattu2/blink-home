import React, { FC, useImperativeHandle } from "react";
import { Card, Popconfirm, Tag } from "antd";
import { EditOutlined, CloudSyncOutlined } from "@ant-design/icons";
import Thumbnail from "@/components/Thumbnail";
import { updateThumbnailImage } from "@/api/actions";

const { Meta } = Card;

export const runtime = "edge";

type Props<T extends BaseVisionDevice<unknown>> = {
  device: T;
};

export type VisionCardMethods = {
  refreshThumbnail: () => void;
};

/**
 * Builds a Dashboard card for a Blink vision-enabled device.
 *
 * @param {Props<BaseVisionDevice<unknown>>} { device }
 * @returns {React.FC}
 */
const VisionDeviceCard = (
  { device }: Props<BaseVisionDevice<unknown>>,
  ref: React.Ref<VisionCardMethods>,
) => {
  const { name, thumbnail, updated_at, type, id, network_id } = device;

  const refreshThumbnail = async () => {
    const response = await updateThumbnailImage(network_id, id, type);
    // TODO: watch the command status and refresh the thumbnail
    console.log(response);
  };

  useImperativeHandle(ref, () => ({ refreshThumbnail }), [id]);

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

export default React.forwardRef(VisionDeviceCard) as FC<
  Props<BaseVisionDevice<unknown>> & { ref?: React.Ref<VisionCardMethods> }
>;
