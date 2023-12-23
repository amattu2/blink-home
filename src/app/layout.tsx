import type { Metadata } from "next";
import { FC } from "react";

export const metadata: Metadata = {
  title: "Blink Home",
  description:
    "A web-based Blink Home monitoring system app built with Next.js and Antd",
};

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
