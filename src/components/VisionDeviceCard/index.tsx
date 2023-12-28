import { FC } from "react";
import Thumbnail from "@/components/Thumbnail";

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
  const { name, thumbnail, updated_at, type } = device;

  return (
    <div>
      <p>
        {name} - {type}
      </p>
      <p>Last seen {updated_at}</p>
      <Thumbnail src={thumbnail} alt={name} width={560} height={315} />
    </div>
  );
};

export default VisionDeviceCard;
