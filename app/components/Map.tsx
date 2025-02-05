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
    //添加一个 onClick 属性，用于处理地图点击事件，然后在 Home 组件中调用，实现点击显示车位信息
    onClick: (spot: ParkingSpot) => void;
    onMapReady: (updateMarkers: (spots: ParkingSpot[]) => void) => void;
}

export default function MapComponent({  onClick, onMapReady }: MapComponentProps) {
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

    const updateMarkers = (spots: ParkingSpot[]) => {
        if (!mapInstance.current || !markerGroup.current) return;
    
        markerGroup.current.clearOverlays(); // 清空已有标记
    
        const markers = spots.map((spot) => {
            const marker = new AMap.Marker({
                position: spot.position,
                title: spot.name,
                icon: new AMap.Icon({
                  size: new AMap.Size(40, 40),
                  image: "/logo.png", // 替换为你的 logo 图片
                  imageSize: new AMap.Size(40, 40),
                }),
              });
        
              // 监听点击事件，通知 Home 组件
              marker.on("click", () => {
                onClick(spot);
              });
        
              return marker;
        });
    
        markerGroup.current.addOverlays(markers); // 添加新标记
    };
    return <div ref={mapContainer} className="w-full h-full" />;
}
