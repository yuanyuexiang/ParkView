"use client";

import React, { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";

export default function MapComponent() {
  const mapContainer = useRef<HTMLDivElement>(null); // 地图容器
  const mapInstance = useRef<AMap.Map | null>(null); // 地图实例

  const parkingSpots = [
    { id: 1, name: "车位1", position: [116.397428, 39.90923] },
    { id: 2, name: "车位2", position: [116.407428, 39.91823] },
    { id: 3, name: "车位3", position: [116.417428, 39.92723] },
  ];

  useEffect(() => {
    AMapLoader.load({
      key: "1250891f059d22237c930269df2b0633", // 高德地图 API Key
      version: "2.0", // JS API 版本
    })
      .then((AMap) => {
        // 初始化地图实例
        mapInstance.current = new AMap.Map(mapContainer.current!, {
          zoom: 14, // 地图缩放级别
          center: [116.397428, 39.90923], // 地图中心点
        });

        // 添加标记点
        parkingSpots.forEach((spot) => {
          const marker = new AMap.Marker({
            position: spot.position as [number, number],
            title: spot.name,
          });

          marker.setContent(`
            <div class="flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md cursor-pointer">
              ${spot.name}
            </div>
          `);

          marker.on("click", () => {
            alert(`点击了 ${spot.name}`);
          });

          mapInstance.current!.add(marker);
        });
      })
      .catch((error) => {
        console.error("高德地图加载失败：", error);
      });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.destroy();
      }
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
