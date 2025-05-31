import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Skeleton } from "antd";
import { getLiveStreamConfig } from "@/api/actions";

export type StreamPlayerProps = {
  network_id: number;
  device_id: number;
  device_type: VisionDeviceType;
};

export type StreamPlayerMethods = {
  /**
   * Boolean indicating if the live stream is currently playing
   */
  playing: boolean;
  /**
   * Resumes the live stream playback
   */
  resume: () => void;
  /**
   * Pauses the live stream playback
   */
  pause: () => void;
};

/**
 * Provides a integration wrapper for the Blink-Liveview-Middleware streaming
 * library.
 *
 * @returns The StreamPlayer component
 */
const StreamPlayer = (
  { network_id, device_id, device_type }: StreamPlayerProps,
  ref: React.Ref<StreamPlayerMethods>,
) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>();

  const handleStartStream = useCallback(async () => {
    const config: LivestreamConfig | null = await handleFetchConfig(
      network_id,
      device_id,
      device_type,
    );

    if (!config) {
      throw new Error("Failed to fetch live stream config");
    }

    handleOpenWebSocket(config);
  }, []);

  const handleFetchConfig = useCallback(
    async (network: number, device: number, type: VisionDeviceType) => {
      try {
        const { status, data } = await getLiveStreamConfig(
          network,
          device,
          type,
        );

        if (status !== "ok" || !data) {
          throw new Error(`Failed to fetch live stream config`);
        }

        return data;
      } catch (error) {
        return null;
      }
    },
    [],
  );

  const handleOpenWebSocket = useCallback((config: LivestreamConfig) => {
    if (socket.current) {
      socket.current.close();
    }

    socket.current = new WebSocket(config.stream_url);
    socket.current.binaryType = "arraybuffer";

    socket.current.onopen = () => {
      // console.log("opened socket");
    };

    socket.current.onclose = () => {
      // console.log("closed socket");
    };

    socket.current.onmessage = () => {
      // console.log("received message: ");
    };

    socket.current.onerror = () => {
      // console.error("WebSocket error occurred");
    };
  }, []);

  const handleResume = useCallback(() => {
    setPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setPlaying(false);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      playing,
      resume: handleResume,
      pause: handlePause,
    }),
    [playing, handleResume, handlePause],
  );

  useEffect(() => {
    handleStartStream();
  }, [network_id, device_id, device_type, handleStartStream]);

  if (!playing) {
    return <Skeleton.Image active style={{ width: 560, height: 315 }} />;
  }

  return <div>Video player here</div>;
};

export default React.forwardRef(StreamPlayer) as React.FC<
  StreamPlayerProps & { ref?: React.Ref<StreamPlayerMethods> }
>;
