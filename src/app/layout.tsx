import type { Metadata } from "next";
import { CSSProperties, FC } from "react";

export const runtime = "edge";

export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description:
    "A web-based Blink Home monitoring system app built with Next.js and Antd",
};

const RootStyling: CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: "sans-serif",
  backgroundColor: "#f2f2f2",
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en" style={RootStyling}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
