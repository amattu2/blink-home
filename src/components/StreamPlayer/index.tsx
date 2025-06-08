/* eslint-disable no-console */
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Skeleton } from "antd";
import { getLiveStreamConfig } from "@/api/actions";

type BlinkMiddlewareCommand = "liveview:start" | "liveview:stop";

type BlinkMiddlewareLivestreamConfig = {
  account_region: string;
  api_token: string;
  account_id: string;
  network_id: string;
  camera_id: string;
  camera_type: string;
};

type BlinkMiddlewareInput<T = Record<string, unknown>> = {
  command: BlinkMiddlewareCommand;
  data: T;
};

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
  const [streaming, setStreaming] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<WebSocket | null>();
  const mediaSource = useRef<MediaSource | null>(null);
  const queue = useRef<Uint8Array[]>([]);
  const buffer = useRef<SourceBuffer | null>(null);

  const streamUrl = useMemo<string | null>(() => {
    if (!mediaSource.current) {
      return null;
    }

    return URL.createObjectURL(mediaSource.current);
  }, [mediaSource.current]);

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
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      console.debug("WebSocket already open, skipping re-connection");
      return;
    }

    socket.current = new WebSocket(config.stream_url);
    socket.current.binaryType = "arraybuffer";

    socket.current.onopen = () => {
      console.debug("WebSocket connection opened, requesting stream");

      const request: BlinkMiddlewareInput<BlinkMiddlewareLivestreamConfig> = {
        command: "liveview:start",
        data: {
          account_region: config.account_tier,
          api_token: config.api_token,
          account_id: config.account_id,
          network_id: config.network_id,
          camera_id: config.camera_id,
          camera_type: config.camera_type,
        },
      };
      socket.current?.send(JSON.stringify(request));
    };

    socket.current.onclose = () => {
      console.log("closed socket");
    };

    socket.current.onmessage = (d) => {
      if (d.data instanceof ArrayBuffer) {
        queue.current.push(new Uint8Array(d.data));
        if (buffer.current && !buffer.current.updating) {
          const chunk = queue.current.shift();
          if (chunk) {
            buffer.current.appendBuffer(chunk);
          }
        }
        return;
      }

      try {
        const response: BlinkMiddlewareInput = JSON.parse(d.data as string);
        if (response.command === "liveview:stop") {
          console.debug("Live stream stopped by server");
          setStreaming(false);
          setPlaying(false);
        } else if (response.command === "liveview:start") {
          console.debug("Live stream started successfully");
          setStreaming(true);
          setPlaying(true);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.current.onerror = () => {
      // console.error("WebSocket error occurred");
    };
  }, []);

  const handleResume = useCallback(() => {
    if (!streaming) {
      return;
    }

    videoRef.current?.play();
    setPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    if (!streaming) {
      return;
    }

    videoRef.current?.pause();
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

  useEffect(
    () => () => {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        const request: BlinkMiddlewareInput = {
          command: "liveview:stop",
          data: {},
        };
        socket.current.send(JSON.stringify(request));
        socket.current.close();
        console.debug("WebSocket connection closed");
      }
    },
    [],
  );

  useEffect(() => {
    if (!mediaSource.current) {
      mediaSource.current = new MediaSource();
    }

    mediaSource.current.addEventListener("sourceopen", () => {
      if (!mediaSource.current || !mediaSource.current.readyState) {
        console.error("MediaSource is not ready");
        return;
      }

      if (mediaSource.current.sourceBuffers.length > 0) {
        console.warn(
          "MediaSource already has source buffers, not adding new one",
        );
        return;
      }

      buffer.current = mediaSource.current.addSourceBuffer(
        'video/mp4; codecs="avc1.640029,mp4a.40.2"',
      );
      buffer.current.mode = "segments";
      buffer.current.addEventListener("updateend", () => {
        if (queue.current.length > 0 && !buffer.current?.updating) {
          buffer.current?.appendBuffer(
            queue.current.shift() || new ArrayBuffer(0),
          );
        }
      });
    });
  }, []);

  if (!streaming || !streamUrl) {
    return <Skeleton.Image active style={{ width: 560, height: 315 }} />;
  }

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video ref={videoRef} src={streamUrl} />;
};

export default React.forwardRef(StreamPlayer) as React.FC<
  StreamPlayerProps & { ref?: React.Ref<StreamPlayerMethods> }
>;
