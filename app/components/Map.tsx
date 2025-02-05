"use client";

import React, { useEffect, useRef } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import "@amap/amap-jsapi-types";

interface ParkingSpot {
    id: number;
    name: string;
    position: [number, number]; // 确保是 [经度, 纬度]
}

interface MapComponentProps {
    //parkingSpots: ParkingSpot[];
    onMapReady: (updateMarkers: (spots: ParkingSpot[]) => void) => void;
}

export default function MapComponent({ onMapReady }: MapComponentProps) {
    const mapContainer = useRef<HTMLDivElement>(null); // 地图容器
    const mapInstance = useRef<AMap.Map | null>(null); // 地图实例
    const markerGroup = useRef<AMap.OverlayGroup | null>(null);

    // 初始化地图
    useEffect(() => {
        console.log("初始化地图...");
        AMapLoader.load({
            key: "1250891f059d22237c930269df2b0633", // 高德地图 API Key
            version: "2.0", // JS API 版本
        }).then((AMap) => {
            console.log("创建地图实例...");
            mapInstance.current = new AMap.Map(mapContainer.current!, {
                zoom: 14, // 地图缩放级别
                center: [116.397428, 39.90923], // 初始地图中心点 [经度, 纬度]
            });

            // 初始化覆盖物分组（管理多个 Marker）
            markerGroup.current = new AMap.OverlayGroup();
            mapInstance.current!.add(markerGroup.current!);

            // 通知父组件地图已准备好，并提供 updateMarkers 方法
            onMapReady(updateMarkers);
        })
        .catch((error) => {
            console.error("高德地图加载失败：", error);
        });

        return () => {
            console.log("销毁地图实例...");
            if (mapInstance.current) {
                mapInstance.current.destroy();
                mapInstance.current = null;
            }
        };
    }, [onMapReady]);

    /*
    // 渲染标记点
    useEffect(() => {
        console.log("地图未准备好，跳过标记点渲染----", isMapReady, mapInstance.current);
        if (!isMapReady || !mapInstance.current) {
            console.log("地图未准备好，跳过标记点渲染");
            return;
        }

        console.log("开始渲染标记点...");
        try {
            // 清除地图上的所有覆盖物
            mapInstance.current.clearMap();

            // 添加新的标记点
            parkingSpots.forEach((spot, index) => {
                if (!spot.position || spot.position.length !== 2) {
                    console.error(`停车点数据格式错误 (index: ${index}):`, spot);
                    return;
                }

                const marker = new AMap.Marker({
                    position: spot.position, // [经度, 纬度]
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

                // 添加标记到地图
                marker.setMap(mapInstance.current);
            });

            console.log("标记点渲染完成，数量：", parkingSpots.length);
        } catch (error) {
            console.error("渲染标记点时发生错误：", error);
        }
    }, [parkingSpots, isMapReady]);

    */

    const updateMarkers = (spots: ParkingSpot[]) => {
        if (!mapInstance.current || !markerGroup.current) return;
    
        markerGroup.current.clearOverlays(); // 清空已有标记
    
        const markers = spots.map((spot) => {
          return new AMap.Marker({
            position: spot.position,
            title: spot.name,
            icon: new AMap.Icon({
                size: new AMap.Size(40, 40), // 图标大小
                image: '/logo.png', // 你的 logo 图片路径
                imageSize: new AMap.Size(40, 40),
              }),
          });
        });
    
        markerGroup.current.addOverlays(markers); // 添加新标记
    };
    return <div ref={mapContainer} className="w-full h-full" />;
}
