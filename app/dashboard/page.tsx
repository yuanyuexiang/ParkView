"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

interface ParkingSpot {
  id: number;
  name: string;
  position: [number, number];
}

export default function Dashboard() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]); // 停车位数据
  const [loading, setLoading] = useState<boolean>(true); // 加载状态
  const [error, setError] = useState<string | null>(null); // 错误信息

  useEffect(() => {
    const fetchParkingSpots = async () => {
      try {
        const response = await fetch("/park/v1/parking-spot");
        if (!response.ok) {
          throw new Error(`HTTP 错误：状态码 ${response.status}`);
        }

        const result = await response.json();
        const dataList = result.data.list || [];

        // 格式化数据为 MapComponent 所需的形式
        const formattedData: ParkingSpot[] = dataList.map((spot: any) => ({
          id: spot.id,
          name: spot.name || "未命名车位", // 如果名字为空，设置默认值
          position: [spot.longitude, spot.latitude] as [number, number],
        }));
        console.log("formattedData", formattedData);
        setParkingSpots(formattedData);
        setLoading(false);
      } catch (err: any) {
        console.error("获取停车位数据失败：", err);
        setError(err.message || "未知错误");
        setLoading(false);
      }
    };

    fetchParkingSpots();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-500">加载中...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-lg text-red-500">错误：{error}</div>;
  }

  return (
    <div className="w-full h-[500px]">
      <MapComponent parkingSpots={parkingSpots} />
    </div>
  );
}