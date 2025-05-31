import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import { ImageProps, Space, Tooltip } from "antd";
import { PauseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Thumbnail from "@/components/Thumbnail";
import StreamPlayer, { StreamPlayerMethods } from "../StreamPlayer";

export type ThumbnailWrapperProps = {
  /**
   * The fully-qualified URL of the thumbnail image
   */
  thumbnail: string;
  /**
   * The alt text for the thumbnail image
   */
  alt: string;
  /**
   * The device associated with the thumbnail
   */
  device: BaseVisionDevice<unknown>;
};

const PreviewMask: React.FC = () => (
  <Tooltip title="Start Live View" placement="top">
    <PlayCircleOutlined style={{ fontSize: "28px" }} />
  </Tooltip>
);

/**
 * Provides a wrapper for the Thumbnail component to be used in the VisionDeviceCard component.
 *
 * @param Props The props for the ThumbnailWrapper component
 * @returns The wrapped Thumbnail component
 */
const ThumbnailWrapper: React.FC<ThumbnailWrapperProps> = ({
  thumbnail,
  alt,
  device,
}) => {
  const [, setVisible] = useState<boolean>(false);
  const streamMethods = useRef<StreamPlayerMethods>(null);

  const handleVisibleChange = useCallback(
    (visible: boolean) => {
      setVisible(visible);
      if (!visible) {
        streamMethods.current?.pause();
      }
    },
    [setVisible],
  );

  const handleToolbarRender = useCallback(
    () => (
      <Space size={12}>
        {/* TODO: Switch icon based on stream state */}
        <PauseOutlined style={{ fontSize: 18 }} />
        <PlayCircleOutlined style={{ fontSize: 18 }} />
      </Space>
    ),
    [],
  );

  const handlePreviewRender = useCallback(
    () => (
      <StreamPlayer
        network_id={device.network_id}
        device_id={device.id}
        device_type={device.type}
        ref={streamMethods}
      />
    ),
    [],
  );

  const previewOptions = useMemo<ImageProps["preview"]>(
    () => ({
      destroyOnClose: true,
      mask: <PreviewMask />,
      onVisibleChange: handleVisibleChange,
      imageRender: handlePreviewRender,
      toolbarRender: handleToolbarRender,
    }),
    [handleVisibleChange, handlePreviewRender, handleToolbarRender],
  );

  return (
    <Thumbnail
      src={thumbnail}
      alt={alt}
      width={560}
      height={315}
      preview={previewOptions}
    />
  );
};

export default memo<ThumbnailWrapperProps>(ThumbnailWrapper);
