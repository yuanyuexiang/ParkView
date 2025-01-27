// "use client";
// app/page.tsx

// import React, { useEffect, useRef } from 'react';
// import AMapLoader  from '@amap/amap-jsapi-loader';
// import 'tailwindcss/tailwind.css'; // 引入 Tailwind CSS
// import "@amap/amap-jsapi-types";
// //import type { Browser as AMapInstance } from "@amap/amap-jsapi-types";

// export default function Home() {
//   const mapContainer = useRef<HTMLDivElement>(null); // 地图容器
//   //const mapInstance = useRef<AMap>(null); // 地图实例
//   const mapInstance = useRef<AMap.Map | null>(null); // 地图实例

//   const parkingSpots = [
//     { id: 1, name: '车位1', position: [116.397428, 39.90923] },
//     { id: 2, name: '车位2', position: [116.407428, 39.91823] },
//     { id: 3, name: '车位3', position: [116.417428, 39.92723] },
//   ];

//   useEffect(() => {
//     if (typeof window === "undefined") {
//         // 在服务端渲染时直接返回
//         return;
//     }
  
//     AMapLoader.load({
//       key: '1250891f059d22237c930269df2b0633', // 高德地图 API Key
//       version: '2.0', // JS API 版本
//     })
//       .then((AMap) => {
//         // 初始化地图实例
//         mapInstance.current = new AMap.Map(mapContainer.current!, {
//           zoom: 14, // 地图缩放级别
//           center: [116.397428, 39.90923], // 地图中心点
//         });

//         // 添加标记点
//         parkingSpots.forEach((spot) => {
//           const marker = new AMap.Marker({
//             position: spot.position,
//             title: spot.name,
//             offset: new AMap.Pixel(-10, -30), // 偏移量
//           });

//           // 自定义标记内容
//           marker.setContent(`
//             <div class="flex items-center justify-center bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md cursor-pointer">
//               ${spot.name}
//             </div>
//           `);

//           // 添加点击事件
//           marker.on('click', () => {
//             alert(`点击了 ${spot.name}`);
//           });

//           // 将标记添加到地图
//           mapInstance.current!.add(marker);
//         });
//       })
//       .catch((error) => {
//         console.error('高德地图加载失败：', error);
//       });

//     return () => {
//       // 清理地图实例
//       if (mapInstance.current) {
//         mapInstance.current.destroy();
//       }
//     };
//   }, []);

//   return (
//     <div style={{ width: '100%', height: '500px' }}>
//       <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
//     </div>
//   );
// }

"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });

interface ParkingSpot {
  id: number;
  name: string;
  position: [number, number];
}

interface Spot {
    id: number;
    name: string;
    longitude: number;
    latitude: number;
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
        const formattedData: ParkingSpot[] = dataList.map((spot: Spot) => ({
          id: spot.id,
          name: spot.name || "未命名车位", // 如果名字为空，设置默认值
          position: [spot.longitude, spot.latitude] as [number, number],
        }));
        console.log("formattedData", formattedData);
        setParkingSpots(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("获取停车位数据失败", error);
        setError("未知错误");
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