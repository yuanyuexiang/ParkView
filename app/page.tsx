"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import "tailwindcss/tailwind.css";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import { Button } from 'antd';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;

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

export default function Home() {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null); // 选中的车位
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
        setSelectedSpot(spot); // 选中车位，显示模态框
    };


    // const setSelectedSpot = (spot: ParkingSpot) => {
    //     console.log("点击了车位：", spot);
    //     alert(`点击了车位：${spot.name}`);
    // };

    useEffect(() => {
        if (updateMarkersRef.current) {
            updateMarkersRef.current(parkingSpots); // 当 parkingSpots 变化时，更新地图标记点
        }
    }, [parkingSpots]);

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };

    return (
        <div className="w-full  flex flex-col items-center justify-center">
          {/* 地图容器，确保 overlay 仅覆盖 MapComponent */}
          <div className="relative w-full h-[500px]">
            {/* 地图组件 */}
            <MapComponent
              onClick={handleSpotClick}
              onMapReady={(updateMarkers) => {
                updateMarkersRef.current = updateMarkers;
                if (parkingSpots.length > 0) {
                  updateMarkers(parkingSpots);
                }
              }}
            />
    
            {/* 仅覆盖 MapComponent，确保 absolute 是相对于地图容器的 */}
            {selectedSpot && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex flex-raw text-white p-4"
                    onClick={() => setSelectedSpot(null)} >
                    
                    {/* <div>
                        <Image
                            src="/tcw.jpg"
                            alt="Logo"
                            width={800}
                            height={800}
                            className="mx-auto h-full w-full"
                        />
                    </div> */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">{selectedSpot.name}</h2>
                        <p className="text-lg">车位 ID: {selectedSpot.id}</p>
                        <p className="text-lg">经度: {selectedSpot.position[0]}</p>
                        <p className="text-lg">纬度: {selectedSpot.position[1]}</p>

                        <RangePicker

                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                            onChange={(value, dateString) => {
                                console.log('Selected Time: ', value);
                                console.log('Formatted Selected Time: ', dateString);
                            }}
                            onOk={onOk} />
                        <Button type="primary">租赁</Button>
                    </div>
                </div>
            )}
          </div>
        </div>
    );
}
