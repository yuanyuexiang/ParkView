"use client";

import dynamic from "next/dynamic";
import "tailwindcss/tailwind.css";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

export default function Dashboard() {
  return (
    <div className="w-full h-[500px]">
      <MapComponent />
    </div>
  );
}