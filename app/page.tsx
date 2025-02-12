"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "tailwindcss/tailwind.css";
import { DatePicker, Image } from 'antd';
import type { DatePickerProps, GetProps} from 'antd';
import { Button } from 'antd';
import dayjs from 'dayjs';

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useConnectModal } from '@rainbow-me/rainbowkit';
import abi from "@/app/abi/ParkingLot.json"; // ✅ 正确导入 ABI


type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;
const { RangePicker } = DatePicker;
const MapComponent = dynamic(() => import("./components/Map"), { ssr: false });

/**
 * @notice 车位信息结构体
 * @param id 车位ID
 * @param name 车位名称
 * @param picture 车位图片
 * @param location 车位地址
 * @param owner 车位所有者
 * @param renter 租户地址
 * @param rent_end_time 租赁结束时间
 * @param rent_price 租金（单位：wei）
 * @param position 车位经纬度
 * @param create_time 创建时间
 * @param update_time 更新时间
 * @dev 该结构体用于存储车位的相关信息
 */
export interface ParkingSpot {
    id: number;
    name: string;
    picture: string;
    location: string;
    owner: string;
    renter: string;
    rent_end_time: string;
    rent_price: number;
    rent_status: boolean;
    position: [number, number];
    create_time: string;
    update_time: string;
    property: boolean;
}

interface Spot {
    id: number;
    name: string;
    picture: string;
    location: string;
    owner: string;
    renter: string;
    rent_end_time: string;
    rent_price: number;
    longitude: number;
    latitude: number;
    create_time: number;
    update_time: number;
}


export default function Home() {
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null); // 选中的车位
    const updateMarkersRef = useRef<((spots: ParkingSpot[]) => void) | null>(null); // 修改类型
    //const [txHash, setTxHash] = useState<string | undefined>(undefined);

    /**
     * 获取钱包地址和连接状态
     */
    const { address, isConnected } = useAccount();

    /**
     * 打开连接钱包的模态框
     */
    const { openConnectModal } = useConnectModal();
    
    /**
     * @notice mantleSepoliaTestnet
     */
    const contractAddress = "0x6272877556b8da0edeec2abbbdb8c6e8346c4f94";

    /**
     * 
     * 获取停车位数据
     */
    const {data:parkingSpotList}: { data: Spot[] | undefined } = useReadContract({
        address: contractAddress,
        abi,
        functionName: "getAllParkingSpots",
    });

    /**
     * @notice 租赁车位时间
     */
    const duration = {
        start: 0,
        end: 0,
        lag: 0
    }

    useEffect(() => {
        console.log("获取停车位数据...");
        //fetchParkingSpots();
        if (parkingSpotList) {
            const formattedData: ParkingSpot[] =  parkingSpotList.map((spot: Spot) => ({
                id: spot.id,
                name: spot.name,
                picture: spot.picture,
                location: spot.location,
                owner: spot.owner,
                renter: spot.renter,
                rent_end_time: spot.rent_end_time,
                rent_price: spot.rent_price,
                rent_status: spot.renter === "0x0000000000000000000000000000000000000000",
                position: [Number(spot.longitude)/1_000_000, Number(spot.latitude)/1_000_000] as [number, number],
                create_time: new Date(Number(spot.create_time) * 1000).toLocaleString(),
                update_time:  new Date(Number(spot.update_time) * 1000).toLocaleString(),
                property: spot.owner === address
            }));
            setParkingSpots(formattedData);
        }
    }, [parkingSpotList]);

    // 处理点击标记点事件
    const handleSpotClick = (spot: ParkingSpot) => {
        setSelectedSpot(spot);
        console.log("点击了车位：", spot);
    };

    const handleMapReady = useCallback((updateMarkers:(spots: ParkingSpot[]) => void) => {
        updateMarkersRef.current = updateMarkers;
        if (parkingSpots.length > 0) {
            updateMarkers(parkingSpots);
        }
    }, [parkingSpots]); // 只有当 `parkingSpots` 变化时更新

    const { writeContractAsync, data:txHash } = useWriteContract();
    // 监听交易完成
    const { data: receipt, isError, error } = useWaitForTransactionReceipt({ hash: txHash });

    // button click
    const handleRent = async() => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }
        console.log(`当前钱包地址: ${address}`);
        console.log('执行你的操作...');
        console.log("租赁车位");


        try {
            
        } catch (error) {
            console.error("获取 ETH/CNY 汇率失败:", error);
        }

        try {
            // 获取 MNT/CNY 汇率
            const response = await fetch(
                "https://api.coingecko.com/api/v3/simple/price?ids=mantle&vs_currencies=cny"
            );
            const data = await response.json();

            //汇率
            const rate = data.mantle.cny;

            console.log("MNT/CNY 汇率:", rate);
            
            //获取当前车位的租金
            console.log("当前车位的租金:", selectedSpot!.rent_price);
            console.log("租赁时长:", BigInt(Math.round(duration.lag)));

            // 定义一个指数n = 10**18 用于计算租金,但为了方便测试改成了10**14
            const n = 10**14;

            //支付金额
            const total_value = BigInt(
                Math.round((Number(selectedSpot!.rent_price) / Number(rate)) * Number(duration.lag) * n)
            );
            
            console.log("支付金额:", total_value, "wei");

            // 调用合约方法
            await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "rent",
                args: [BigInt(selectedSpot!.id), BigInt(Math.round(duration.lag))], // 传递 tokenId 和租赁时长
                value: total_value//BigInt(0.0002*10**18) // 传递 ETH 价值
            });
            
            // 关闭弹窗
            setSelectedSpot(null);
        } catch (error) {
            console.log("租用失败", error);
        }
    };

    useEffect(() => {
        if (receipt) {
            console.log("交易成功，区块号：", receipt.blockNumber);
            alert("Mint 成功！区块号：" + receipt.blockNumber);
        }
        if (isError) {
            console.error("Mint 失败", error);
            alert("Mint 失败");
        }
    }, [receipt, isError, error]);

    // 当 parkingSpots 变化时，更新地图标记点
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
                    onMapReady={handleMapReady} />
    
                    {/* 仅覆盖 MapComponent，确保 absolute 是相对于地图容器的 */} 
                    {selectedSpot && (
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center p-2"
                        onClick={() => setSelectedSpot(null)} >
                        <div
                            className="w-150 bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-gray-300 flex"
                            onClick={(e) => e.stopPropagation()} >
                            {/* 左侧 - 标题 & 车位图片 */}
                            <div className="w-2/5 flex flex-col items-center pr-6">
                                {/* 标题 */}
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{selectedSpot.name}</h2>
                        
                                {/* 车位图片 */}
                                <Image
                                    src={selectedSpot.picture}
                                    alt="车位图片"
                                    className="w-full max-h-52 object-cover rounded-lg shadow-md"
                                />
                            </div>
                        
                            {/* 右侧 - 车位信息 & 交互 */}
                            <div className="w-3/5 flex flex-col justify-between">
                                {/* 车位详情 */}
                                <div className="space-y-2 text-gray-700">
                                    <p className="text-lg font-medium">🚗 车位序号: <span className="font-semibold">{selectedSpot.id}</span></p>
                                    <p className="text-lg font-medium">
                                        🔹 车位状态: 
                                        <span className={`font-semibold ml-1 ${selectedSpot.rent_status? "text-green-600" : "text-red-600"}`}>
                                            {selectedSpot.rent_status ? "可租赁 ✅" : "已租出 ❌"}
                                        </span>
                                    </p>
                                    <p className="text-lg font-medium truncate w-180" title={selectedSpot.location}>
                                    📍 车位地址: <span className="font-semibold">{selectedSpot.location}</span>
                                    </p>
                                    <p className="text-lg font-medium">💰 车位租金: <span className="font-semibold text-blue-600">{selectedSpot.rent_price}￥/天</span></p>
                                    <p className="text-lg font-medium">👤 车位业主: <span className="font-semibold">{selectedSpot.owner.slice(0, 4) + "…" + selectedSpot.owner.slice(-4)}</span></p>
                                    <p className="text-lg font-medium">📅 创建时间: <span className="font-semibold">{selectedSpot.create_time}</span></p>
                                    <p className="text-lg font-medium">🕒 更新时间: <span className="font-semibold">{selectedSpot.update_time}</span></p>
                                </div>
                        
                                {/* 操作按钮 */}
                                <div className="mt-5 flex items-center space-x-4">
                                    <RangePicker
                                        defaultValue={[dayjs(), null]} // 第一项默认当前时间
                                        disabled={[true, !selectedSpot.rent_status]} // 禁用第一项
                                        showTime={{ format: "HH:mm" }}
                                        format="YYYY-MM-DD HH:mm"
                                        onChange={(value, dateString) => {
                                            console.log("Selected Time: ", value);
                                            console.log("Formatted Selected Time: ", dateString);
                                            // 分别打印dateString时间戳
                                            console.log("Formatted Selected Time: ", new Date(dateString[0]).getTime());
                                            console.log("Formatted Selected Time: ", new Date(dateString[1]).getTime());
                                            // 获取时间戳之间的天数
                                            console.log("Formatted Selected Time: ", (new Date(dateString[1]).getTime() - new Date(dateString[0]).getTime()) / (1000 * 60 * 60 * 24));
                                            duration.start = new Date(dateString[0]).getTime();
                                            duration.end = new Date(dateString[1]).getTime();
                                            duration.lag = (new Date(dateString[1]).getTime() - new Date(dateString[0]).getTime()) / (1000 * 60 * 60 * 24);
                                        }}
                                        onOk={onOk}
                                        //disabled={!selectedSpot.rent_status}
                                        className="rounded-lg border border-gray-300 shadow-sm p-2"
                                    />
                                    <Button 
                                        type="primary" 
                                        onClick={handleRent} 
                                        disabled={!selectedSpot.rent_status}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                                    >
                                        租赁
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
