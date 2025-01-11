import React, { FC, useImperativeHandle, useMemo } from "react";
import { Card, Popconfirm, Tag, notification } from "antd";
import { EditOutlined, CloudSyncOutlined } from "@ant-design/icons";
import Thumbnail from "@/components/Thumbnail";
import { updateThumbnailImage } from "@/api/actions";
import { getDeviceNameFromType } from "@/utils/dashboard";

const { Meta } = Card;

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
  const { name, thumbnail, updated_at, type, id, network_id, status } = device;
  const [api, contextHolder] = notification.useNotification();

  const batteryState = useMemo<string | null>(() => {
    if (!("battery" in device) || typeof device?.battery !== "string") {
      return null;
    }

    const battery = device.battery as BatteryState;
    if (battery === "low") {
      return "Low Battery";
    }

    return null;
  }, [device]);

  const refreshThumbnail = async () => {
    const response = await updateThumbnailImage(network_id, id, type);
    if (response && !!response) {
      device.thumbnail = response;
    } else {
      api.error({
        message: "Failed to refresh thumbnail",
        description: `An error occurred while refreshing the thumbnail for device "${name}"`,
      });
    }
  };

  useImperativeHandle(ref, () => ({ refreshThumbnail }), [id]);

  return (
    <>
      {contextHolder}
      <Card
        style={{ width: 560 }}
        cover={
          <Thumbnail src={thumbnail} alt={name} width={560} height={315} />
        }
        actions={[
          <Popconfirm
            key="sync"
            title="Refresh thumbnail?"
            description="Are you sure to refresh this thumbnail?"
            onConfirm={refreshThumbnail}
            okText="Yes"
            cancelText="No"
            disabled={status === "offline"}
          >
            <CloudSyncOutlined key="setting" />
          </Popconfirm>,
          <EditOutlined key="edit" disabled={status === "offline"} />,
        ]}
      >
        <Meta
          title={name}
          description={
            <>
              <p>Last updated {updated_at}</p>
              <Tag>{getDeviceNameFromType(type)}</Tag>
              {batteryState && <Tag color="orange">{batteryState}</Tag>}
              {status === "offline" && (
                <Tag color="error" style={{ fontWeight: "bold" }}>
                  Offline
                </Tag>
              )}
            </>
          }
        />
      </Card>
    </>
  );
};

export default React.forwardRef(VisionDeviceCard) as FC<
  Props<BaseVisionDevice<unknown>> & { ref?: React.Ref<VisionCardMethods> }
>;
