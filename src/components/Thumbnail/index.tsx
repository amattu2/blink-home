import { getThumbnailImage } from "@/api/actions";
import { FC, useEffect, useState } from "react";
import { Image, ImageProps, Skeleton } from "antd";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
} & ImageProps;

/**
 * Renders a thumbnail for a Blink device
 *
 * @param src The partial-URL of the thumbnail
 * @param alt The alt text for the image
 * @returns {React.FC<Props>}
 */
const Thumbnail: FC<Props> = ({ src, alt, ...props }) => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const d = await getThumbnailImage(src);
      setImage(d);
    })();
  }, [src]);

  if (!image || !src) {
    return (
      <Skeleton.Image
        active
        style={{ width: props.width, height: props.height }}
      />
    );
  }

  return <Image src={image} alt={alt} {...props} />;
};

export default Thumbnail;
