import type { Metadata } from "next";
import { CSSProperties, FC } from "react";

export const metadata: Metadata = {
  title: process.env.APP_NAME,
  description:
    "A web-based Blink Home monitoring system app built with Next.js and Antd",
};

const RootStyling: CSSProperties = {
  margin: 0,
  padding: 0,
  fontFamily: "sans-serif",
  backgroundColor: "#3b3b3b",
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en" style={RootStyling}>
    <body>{children}</body>
  </html>
);

export default RootLayout;
