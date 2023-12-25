"use client";

import withAuth from "@/hocs/withAuth";
import { FC } from "react";

const Dashboard: FC = () => {
  return <div>Dashboard</div>;
};

export default withAuth(Dashboard, ["LOGGED_IN"]);
