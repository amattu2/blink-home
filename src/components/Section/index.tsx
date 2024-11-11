import { CSSProperties, FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Styling: CSSProperties = {
  marginBottom: "16px",
};

/**
 * Base dashboard section component
 *
 * @param {Props} { children }
 * @returns {React.FC<Props>}
 */
const Section: FC<Props> = ({ children }) => (
  <div style={Styling}>{children}</div>
);

export default Section;
