"use client";

import dynamic from "next/dynamic";

const DynamicComponentWithNoSSR = dynamic(() => import("./Notifications"), {
  ssr: false,
}) as any;

const Notifications = () => <DynamicComponentWithNoSSR />;

export default Notifications;
