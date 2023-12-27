"use client";

import withAuth, { AuthHocProps } from "@/hocs/withAuth";
import { FC } from "react";

const Dashboard: FC<AuthHocProps> = ({ account }) => (
  <div>Dashboard {JSON.stringify(account)}</div>
);

export default withAuth(Dashboard, ["LOGGED_IN"]);
