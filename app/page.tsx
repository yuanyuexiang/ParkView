"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "tailwindcss/tailwind.css";
import { DatePicker } from 'antd';
import type { DatePickerProps, GetProps } from 'antd';
import { Button } from 'antd';

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;
const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });

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
// ParkingSpot ParkingSpot
type ParkingSpot struct {
	ID         int64     `orm:"column(id);pk;auto" json:"id"`
	Address    string    `orm:"column(address)" json:"address" description:"钱包地址"`
	Name       string    `orm:"column(name)" json:"name" description:"名称昵称"`
	Status     int8      `orm:"column(status)" json:"status" description:"上线下线 0:离线 1:在线"`
	Longitude  float64   `orm:"column(longitude)" json:"longitude" description:"经度"`
	Latitude   float64   `orm:"column(latitude)" json:"latitude" description:"纬度"`
	Renter     string    `orm:"column(renter)" json:"renter" description:"租户地址"`
	RentPrice  int64     `orm:"column(rent_price)" json:"rent_price" description:"租金"`
	Content    string    `orm:"column(content)" json:"content" description:"介绍"`
	Remarks    string    `orm:"column(remarks)" json:"remarks" description:"备注"`
	CreateTime time.Time `orm:"column(create_time)" json:"create_time"`
	UpdateTime time.Time `orm:"column(update_time)" json:"update_time"`
}
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

export default function Home() {
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null); // 选中的车位
    const updateMarkersRef = useRef<((spots: ParkingSpot[]) => void) | null>(null); // 修改类型

    /**
     * 
     * 获取停车位数据
     */
    const fetchParkingSpots = async () => {
        try {
            const response = await fetch("/park/v1/parking-spot");
            if (!response.ok) throw new Error(`HTTP 错误：${response.status}`);

            const result = await response.json();
            const formattedData: ParkingSpot[] = result.data.list.map((spot: Spot) => ({
                id: spot.id,
                name: spot.name || "未命名车位",
                address: spot.address,
                status: spot.ststus,
                position: [spot.longitude, spot.latitude] as [number, number],
                renter: spot.renter,
                rent_price: spot.rent_price,
                content: spot.content,
                remarks: spot.remarks,
                create_time: spot.create_time,
                update_time: spot.update_time
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
        console.log("获取停车位数据...");
        fetchParkingSpots();
    }, []);

    // 处理点击标记点事件
    const handleSpotClick = (spot: ParkingSpot) => {
        setSelectedSpot(spot);
        console.log("点击了车位：", spot);
    };

    // const setSelectedSpot = (spot: ParkingSpot) => {
    //     console.log("点击了车位：", spot);
    //     alert(`点击了车位：${spot.name}`);
    // };

    const handleMapReady = useCallback((updateMarkers:(spots: ParkingSpot[]) => void) => {
        updateMarkersRef.current = updateMarkers;
        if (parkingSpots.length > 0) {
            updateMarkers(parkingSpots);
        }
    }, [parkingSpots]); // 只有当 `parkingSpots` 变化时更新

    useEffect(() => {
        if (updateMarkersRef.current) {
            updateMarkersRef.current(parkingSpots); // 当 parkingSpots 变化时，更新地图标记点
        }
    }, [parkingSpots]);

    const onOk = (value: DatePickerProps['value'] | RangePickerProps['value']) => {
        console.log('onOk: ', value);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center">
            {/* 地图容器，确保 overlay 仅覆盖 MapComponent */}
            <div className="relative w-full h-[540px]">
                {/* 地图组件 */}
                <MapComponent
                    onClick={handleSpotClick}
                    onMapReady={handleMapReady}
                    // onMapReady={(updateMarkers) => {
                    //     console.log("地图已准备好，提供 updateMarkers 方法");
                    //     updateMarkersRef.current = updateMarkers;
                    //     if (parkingSpots.length > 0) {
                    //         updateMarkers(parkingSpots);
                    //     }
                    // }} 
                />
    
                {/* 仅覆盖 MapComponent，确保 absolute 是相对于地图容器的 */} 
                {selectedSpot && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 flex flex-raw  p-4"
                    onClick={() => setSelectedSpot(null)} 
                    // onClick={(e) => e.stopPropagation()}
                    >
                    <div className="w-140 bg-white bg-opacity-50  p-4 rounded-lg shadow-lg"
                        onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-2">{selectedSpot.name}</h2>
                        <p className="text-lg">车位 ID: {selectedSpot.id}</p>
                        <p className="text-lg">经度: {selectedSpot.position[0]}</p>
                        <p className="text-lg">纬度: {selectedSpot.position[1]}</p>
                        <p className="text-lg">地址: {selectedSpot.address}</p>
                        <p className="text-lg">租金: {selectedSpot.rent_price}</p>
                        <p className="text-lg">租户: {selectedSpot.renter}</p>
                        <p className="text-lg">介绍: {selectedSpot.content}</p>
                        <p className="text-lg">备注: {selectedSpot.remarks}</p>
                        <p className="text-lg">创建时间: {selectedSpot.create_time}</p>
                        <p className="text-lg">更新时间: {selectedSpot.update_time}</p>
                        <div className="mt-4 flex flex-row">
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                onChange={(value, dateString) => {
                                    console.log('Selected Time: ', value);
                                    console.log('Formatted Selected Time: ', dateString);
                                }}
                                onOk={onOk} 
                                className=""/>
                            <div className="ml-4"/>
                            <Button type="primary" className="">租赁</Button>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
