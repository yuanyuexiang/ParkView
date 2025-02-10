"use client";

import dynamic from "next/dynamic";
import React, { useCallback, useState, useEffect } from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Badge, Card, List, Space, Button, Modal, Form, Input } from "antd";

import abi from "@/app/abi/ParkingLot.json"; // ✅ 正确导入 ABI

import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const { Meta } = Card;

export default function MyParking() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    //const [location, setLocation] = useState({ lng: 116.4, lat: 39.9 }); // 默认北京

    const data = Array.from({ length: 4 }).map((_, i) => ({
        title: `我自己的车位 ${i + 1}`,
        name: `车位名称`,
        address: `北京市朝阳区北京市朝阳区北京市朝阳区北京市朝阳区北京市朝阳区北京市朝阳区`,
        price: 100,
        property: i % 2 === 0,
        description: "这是我的车位，我可以随时出租给别人。",
    }));

    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
        {React.createElement(icon)}
        {text}
        </Space>
    );
    
    const MapSelect = dynamic(() => import("../components/MapSelect"), { ssr: false });

    const contractAddress = "0xf2d614ba26148ed5e2d03934b7dcc16d02c6b47f";
    const { writeContractAsync } = useWriteContract();
    const { isConnected } = useAccount();
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    // 监听交易完成
    const { data: receipt, isError, error } = useWaitForTransactionReceipt({ hash: txHash });
    
    const { openConnectModal } = useConnectModal();

    /*
    // 添加车位
    const addParkingSpot = useCallback(async () => {
        if (!isConnected) {
            console.log("钱包未连接，尝试连接...");
            openConnectModal?.();
            return;
        }

        try {
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "mint",
                args: ["北京市朝阳区", 12, 116, 39],
            });
            setTxHash(txHash as `0x${string}`);
            console.log("Mint 成功", txHash);
        } catch (error) {
            console.error("Mint 失败", error);
        }
    }, [isConnected, writeContractAsync, openConnectModal]);
    */
    // 处理点击“添加车位”按钮
    const handleAddParkingClick = () => {
        setIsModalOpen(true);
    };

    // 处理地图选点
    const handleMapClick = (lng: number, lat: number) => {
        //setLocation({ lng, lat });
        
        console.log("拖动结束，更新坐标:", lng, lat);
        form.setFieldsValue({ longitude: lng, latitude: lat });
    };

    // 处理提交表单
    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            console.log("🚗 添加车位信息：", values);

            if (!isConnected) {
                openConnectModal?.();
                return;
            }

            // 调用合约 Mint
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "mint",
                args: [
                    values.address, 
                    BigInt(values.price), 
                    119,//values.longitude, 
                    31//values.latitude
                ],
            });
            setTxHash(txHash as `0x${string}`);

            // 关闭弹窗
            setIsModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error("Mint 失败", error);
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

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">车位列表（包括租用和自有）</h2>
                <Button type="primary" className="bg-green-500" onClick={handleAddParkingClick} >
                + 添加车位
                </Button>
            </div>

            {/* 🚗 卡片列表 */}
            <List
                grid={{ gutter: 16, column: 3 }} // 3 列布局
                pagination={{
                    pageSize: 9, // 每页 9 个
                    showSizeChanger: false,
                }}
                dataSource={data}
                renderItem={(item) => (
                <List.Item>
                    <Badge.Ribbon text={item.property?"自有":"租赁"} color={item.property?"prink":"green"}>
                        <Card
                            hoverable
                            cover={<img alt="车位图片" src="/tcw.jpg" />}
                            actions={[
                                <IconText icon={StarOutlined} text="156" key="star" />,
                                <IconText icon={LikeOutlined} text="156" key="like" />,
                                <IconText icon={MessageOutlined} text="2" key="message" />,
                            ]}
                            >
                            <Meta title={item.title} />

                            {/* 地址 & 价格 */}
                            <div className="mt-2">
                                <p className="text-gray-500">{item.address}</p>
                                <p className="text-red-500 font-bold">¥{item.price}/天</p>
                            </div>
                        </Card>
                    </Badge.Ribbon>
                </List.Item>
                )}
            />


            {/* 🏠 添加车位对话框 */}
            <Modal
                title="添加车位"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
                okText="确认添加"
                cancelText="取消" 
                width={1000} >
                
                <Form form={form} layout="vertical">
                    <div className="flex gap-4">
                        {/* 左侧：地图选点 */}
                        <div className="w-1/2 h-96 border">
                            <MapSelect onSelect={handleMapClick} />
                        </div>

                        {/* 右侧：表单 */}
                        <div className="w-1/2">
                            <Form.Item
                                label="车位名称"
                                name="name"
                                rules={[{ required: true, message: "请输入车位名称" }]} >
                                <Input placeholder="例如：朝阳区停车位 1" />
                            </Form.Item>

                            <Form.Item
                                label="价格（¥/天）"
                                name="price"
                                rules={[{ required: true, message: "请输入价格" }]} >
                                <Input type="number" placeholder="例如：100" />
                            </Form.Item>

                            <Form.Item
                                label="地址"
                                name="address"
                                rules={[{ required: true, message: "请输入地址" }]} >
                                <Input placeholder="例如：北京市朝阳区 xxx" />
                            </Form.Item>
                        </div>
                    </div>
                </Form>

            </Modal>

        </div>
    );
}
