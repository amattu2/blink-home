import { getMediaVideo } from "@/api/actions";
import { FC, VideoHTMLAttributes, useEffect, useState } from "react";
import { Skeleton } from "antd";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
} & VideoHTMLAttributes<HTMLVideoElement>;

/**
 * Renders a video for a Blink media device
 *
 * @param src The partial-URL of the video source
 * @returns {React.FC<Props>}
 */
const MediaVideo: FC<Props> = ({ src, alt, ...props }) => {
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getMediaVideo(src);
      setVideo(d);
    })();
  }, [src]);

  if (!video || !src) {
    return (
      <Skeleton.Image
        active
        style={{ width: props.width, height: props.height }}
      />
    );
  }

  return (
    <video controls {...props}>
      <source src={video} type="video/mp4" />
      <track kind="captions" />
    </video>
  );
};

export default MediaVideo;
