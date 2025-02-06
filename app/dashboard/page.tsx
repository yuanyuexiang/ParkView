"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState,useRef } from "react";
import "tailwindcss/tailwind.css";

// 动态导入地图组件，禁用 SSR
const MapComponent = dynamic(() => import("../components/Map"), { ssr: false });

/**
 * 停车位数据
 */
interface ParkingSpot {
    id: number;
    address: string;
    name: string;
    position: [number, number];
    ststus: number;
    renter: string;
    rent_price: number;
    content: string;
    remarks: string;
    create_time: string;
    update_time: string;
}

/**
 *
 * 停车位数据
 */
interface Spot {
    id: number;
    address: string;
    name: string;
    ststus: number;
    longitude: number;
    latitude: number;
    renter: string;
    rent_price: number;
    content: string;
    remarks: string;
    create_time: string;
    update_time: string;
}

export default function Dashboard() {
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
      const updateMarkersRef = useRef<((spots: ParkingSpot[]) => void) | null>(null); // 修改类型
    
      const fetchParkingSpots = async () => {
        try {
          const response = await fetch("/park/v1/parking-spot");
          if (!response.ok) throw new Error(`HTTP 错误：${response.status}`);
    
          const result = await response.json();
          const formattedData: ParkingSpot[] = result.data.list.map((spot: Spot) => ({
            id: spot.id,
            name: spot.name || "未命名车位",
            position: [spot.longitude, spot.latitude] as [number, number],
          }));
    
          setParkingSpots(formattedData);
    
          if (updateMarkersRef.current) {
            updateMarkersRef.current(formattedData); // 数据更新后刷新地图
          }
        } catch (error) {
          console.error("获取停车位数据失败", error);
        }
      };
    
      useEffect(() => {
        fetchParkingSpots();
      }, []);

    // 处理点击标记点事件
    const handleSpotClick = (spot: ParkingSpot) => {
        //setSelectedSpot(spot); // 选中车位，显示模态框
        console.log("点击了车位：", spot);
    };
    
      return (
        <div className="w-full h-[500px]">
          <MapComponent
          onClick={handleSpotClick}
            onMapReady={(updateMarkers) => {
              updateMarkersRef.current = updateMarkers; // 修改这里，允许赋值
              if (parkingSpots.length > 0) {
                updateMarkers(parkingSpots); // 初始化时更新标记点
              }
            }}
          />
        </div>
      );
    }
    