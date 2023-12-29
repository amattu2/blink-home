import { getDeviceCount } from "@/utils/dashboard";
import { Card, Col, Row, Statistic, Typography } from "antd";
import { CSSProperties, FC, useMemo } from "react";

type Props = {
  home: Homescreen;
};

const HeaderStyles: CSSProperties = {
  marginTop: "-5px",
  marginBottom: "16px",
};

/**
 * Dashboard page account statistics
 *
 * @param {Props} { home }
 * @returns {React.FC<Props>}
 */
const Statistics: FC<Props> = ({ home }) => {
  const deviceCount: number = useMemo(() => getDeviceCount(home), [home]);

  return (
    <Card>
      <Typography.Title level={4} style={HeaderStyles}>
        Statistics
      </Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span="4">
          <Statistic
            title="Networks"
            value={home.networks.length}
            precision={0}
          />
        </Col>
        <Col span="5">
          <Statistic title="Devices" value={deviceCount} precision={0} />
        </Col>
        <Col span="5">
          <Statistic title="[PLACEHOLDER]" value={0} precision={0} />
        </Col>
        <Col span="5">
          <Statistic title="[PLACEHOLDER]" value={0} precision={0} />
        </Col>
        <Col span="5">
          <Statistic title="[PLACEHOLDER]" value={0} precision={0} />
        </Col>
      </Row>
    </Card>
  );
};

export default Statistics;
