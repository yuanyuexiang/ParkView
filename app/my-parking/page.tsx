"use client";

import dynamic from "next/dynamic";
import React, { useState, useEffect, useMemo } from "react";
import { Badge, Card, List, Image, Button, Modal, Form, Input} from "antd";

import abi from "@/app/abi/ParkingLot.json"; // ✅ 正确导入 ABI

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { notification, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { useQueryClient } from "@tanstack/react-query";

// 定义上传文件类型

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const { Meta } = Card;

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
 * @param latitude 纬度
 * @param longitude 经度
 * @param create_time 创建时间
 * @param update_time 更新时间
 * @dev 该结构体用于存储车位的相关信息
 */
interface ParkingSpot {
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
    create_time: string;
    update_time: string;
}

export default function MyParking() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
    const formDataDefault: ParkingSpot = {
        id: 0,
        name: "默认车位",
        picture: "/tcw.jpg",
        location: "",
        owner: "",
        renter: "",
        rent_end_time: "",
        rent_price: 0,
        longitude: 116.397428,
        latitude: 39.90923,
        create_time: "",
        update_time: "",
        property: false,
    };

    const [formData, setFormData] = useState<ParkingSpot>(formDataDefault);

    const MapSelect = dynamic(() => import("../components/MapSelect"), { ssr: false });

    /**
     * @notice mantleSepoliaTestnet
     */
    const contractAddress = "0x79587ce471e96cB424A650E835C125B68F66b96b";

    const { writeContractAsync } = useWriteContract();
    const { address, isConnected } = useAccount();
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    const queryClient = useQueryClient();
    const { data: parkingSpotList, queryKey }  = useReadContract({
        address: contractAddress,
        abi,
        functionName: "getMyParkingSpots",
        account: address, // 这里必须要传用户钱包地址
    });

    // 监听交易完成
    const { data: receipt, isError, error } = useWaitForTransactionReceipt({ hash: txHash });
    
    const { openConnectModal } = useConnectModal();

    // 处理点击“添加车位”按钮
    const handleAddParkingClick = () => {
        if (!isConnected) {
            openConnectModal?.();
            return;
        }
        setFormData(formDataDefault);
        setIsModalOpen(true);
    };

    // 处理地图选点
    const handleMapClick =  async (lng: number, lat: number) => {
        console.log("拖动结束，更新坐标:", lng, lat);
        console.log("🚗 更新车位位置1信息：", formData);
        setFormData(prev => ({ ...prev, longitude: lng, latitude: lat}));
        console.log("🚗 更新车位位置2信息：", formData);
    };

    
    /**
     * 
     * @param img 
     * @param callback 
     */
    const getBase64 = (img: FileType, callback: (url: string) => void) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result as string));
        reader.readAsDataURL(img);
    };

    /**
     * 
     * @param file 
     * @returns 
     */
    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            notification.warning({
                message: "warning",
                description: 'You can only upload JPG/PNG file!',
            });
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            notification.error({
                message: "error",
                description: 'Image must smaller than 2MB!',
            });
        }
        return isJpgOrPng && isLt2M;
    };

    // 当数据返回时更新状态
    useEffect(() => {
        if (parkingSpotList) {
            console.log("🚗 链端车位列表：", parkingSpotList);
            const formattedData: ParkingSpot[] = (Array.isArray(parkingSpotList) ? parkingSpotList : [])
            .filter((spot: Spot) => {
                return Number(spot.id) > 0
            }) // 过滤掉 id 为 0 的项
            .map((spot: Spot) => ({
                id: spot.id,
                name: spot.name,
                picture: spot.picture,
                location: spot.location,
                owner: spot.owner,
                renter: spot.renter,
                rent_end_time: spot.rent_end_time,
                rent_price: spot.rent_price,
                longitude: Number(spot.longitude)/1_000_000,
                latitude: Number(spot.latitude)/1_000_000,
                create_time: spot.create_time,
                update_time: spot.update_time,
                property: spot.owner === address
            }));
            setParkingSpots(formattedData);
        }
    }, [parkingSpotList, address]);

    const [form] = Form.useForm();
    // 处理提交表单
    const handleOk = async () => {
        if (formData.id > 0) {
            updateParkingSpot();
        }else{
            mintParkingSpot();
        }
    };

    const mintParkingSpot = async () => {
        // 关闭弹窗
        setIsModalOpen(false);
        try {
            console.log("🚗 铸造车位NFT信息：", formData);
            if (!isConnected) {
                openConnectModal?.();
                return;
            }

            // 调用合约 Mint
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "mintParkingSpot",
                args: [
                    formData.name,
                    formData.picture,
                    formData.location,
                    formData.rent_price, 
                    formData.longitude * 10**6,
                    formData.latitude * 10**6
                ],
            });
            setTxHash(txHash as `0x${string}`);

            //form.resetFields();
        } catch (error) {
            console.error("Mint 失败", error);
        }
    }

    /**
     * 更新车位信息
     * @returns 
     */
    const updateParkingSpot = async () => {
        // 关闭弹窗
        setIsModalOpen(false);
        try {
            console.log("🚗 铸造车位NFT信息：", formData);
            if (!isConnected) {
                openConnectModal?.();
                return;
            }

            // 调用合约 Mint
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "updateParkingSpot",
                args: [
                    formData.id,
                    formData.name,
                    formData.picture,
                    formData.location,
                    formData.rent_price, 
                    formData.longitude * 10**6,
                    formData.latitude * 10**6
                ],
            });
            setTxHash(txHash as `0x${string}`);

            //form.resetFields();
        } catch (error) {
            console.error("更新失败", error);
        }
    }

    /**
     * 退租车位
     * @param id 
     * @returns 
     */
    const terminateRentalParkingSpot = async (id: number) => {
        try {
            if (!isConnected) {
                openConnectModal?.();
                return;
            }

            console.log("🚗 退租车位：", id, address);
            // 调用合约 Mint
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "terminateRentalParkingSpot",
                args: [
                    id
                ],
            });
            setTxHash(txHash as `0x${string}`);
        } catch (error) {
            console.error("失败", error);
        }
    };

    /**
     * 撤销车位
     * @param id 
     * @returns 
     */
    const revokeParkingSpot = async (id: number) => {
        try {
            if (!isConnected) {
                openConnectModal?.();
                return;
            }

            // 调用合约 Mint
            const txHash = await writeContractAsync({
                address: contractAddress,
                abi,
                functionName: "revokeParkingSpot",
                args: [
                    id
                ],
            });
            setTxHash(txHash as `0x${string}`);
        } catch (error) {
            console.error("失败", error);
        }
    };

    useEffect(() => {
        console.log("🚗 交易状态：", receipt, isError, error);
        if (receipt) {
            queryClient.invalidateQueries({ queryKey });
            console.log("交易成功，区块号：", receipt.blockNumber);
            notification.success({
                message: "交易成功",
                description: '区块号：' + receipt.blockNumber,
            });
        }
        if (isError) {
            console.error("交易失败", error);
            notification.success({
                message: "交易失败",
                description: error.message,
            });
        }
    }, [receipt, queryKey, isError, error]);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>();

    const handleChange: UploadProps['onChange'] = (info) => {
        console.log("info:", info)
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj as FileType, (url) => {
                //console.log("url:", info.file.response.data.url, url)
                setLoading(false);
                const fileUrl = info.file.response?.data?.url;
                if (!fileUrl) {
                    console.error("File URL not found in response:", info.file.response);
                    return;
                }
                formData.picture = fileUrl;
                console.log("Uploaded file URL:", fileUrl);
                setFormData((prev) => ({ ...prev, picture: fileUrl }));
                setImageUrl(url);
                console.log("formData:", formData)
            });
        }
    };

    // 只有在 `loading` 之外的依赖变更时，才会重新创建 AMap 组件
    const MapSelectComponent = useMemo(() => {
        return <MapSelect onSelect={handleMapClick} defaultLocation={{ lng: formData.longitude, lat: formData.latitude }}/>;
    }, [isModalOpen]); // 这里的 `[]` 只让它初始化一次

    /**
     * 上传按钮
     */
    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    function handleUpdateParkingSpot(item: ParkingSpot): void {
        form.setFieldsValue(formData); // 更新表单数据
        setFormData((prev) => ({ ...prev, 
            id: item.id, 
            name: item.name, 
            picture: item.picture, 
            location: item.location, 
            rent_price: item.rent_price, 
            longitude: item.longitude, 
            latitude: item.latitude, 
            property: item.property 
        }));
        setImageUrl(item.picture);
        console.log("🚗 修改车位信息2：", formData);
        setIsModalOpen(true);
    }

    useEffect(() => {
        console.log("🚗 formData 更新:", formData);
        form.setFieldsValue(formData);
    }, [formData]);

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
                pagination={
                    parkingSpots.length > 0 ? { 
                        pageSize: 9, 
                        showSizeChanger: false 
                    } : false
                }
                dataSource={parkingSpots}
                renderItem={(item) => (
                <List.Item>
                    <Badge.Ribbon text={item.property?"自有":"租赁"} color={item.property?"prink":"green"}>
                        <Card
                            hoverable
                            cover={<Image alt="车位图片" src={item.picture} />}
                            actions={[
                                <Button type="text" size="small" key="terminate" disabled={item.property} onClick={() => terminateRentalParkingSpot(item.id)}>
                                    退租
                                </Button>,
                                <Button type="text" size="small" key="edit" disabled = {!item.property} onClick={() => handleUpdateParkingSpot(item)}>
                                    修改
                                </Button>,
                                <Button type="text" size="small" key="revoke" disabled={!item.property}  onClick={() => revokeParkingSpot(item.id)}>
                                    删除
                                </Button>,
                            ]}
                            >
                            <Meta title={item.name} />

                            {/* 地址 & 价格 */}
                            <div className="mt-2">
                                <p className="text-gray-500">{item.location}</p>
                                <p className="text-red-500 font-bold">¥{item.rent_price}/天</p>
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
                
                <Form layout="vertical" form={form} initialValues={formData}>
                    <div className="flex gap-4">
                        {/* 左侧：地图选点 */}
                        <div className="w-1/2 h-96 border">
                        {MapSelectComponent}
                            {/* <MapSelect onSelect={handleMapClick} /> */}
                        </div>

                        {/* 右侧：表单 */}
                        <div className="w-1/2">
                            <Form.Item
                                label="车位名称"
                                name="name"
                                rules={[{ required: true, message: "请输入车位名称" }]} >
                                <Input placeholder="例如：朝阳区停车位 1" 
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                                    }
                                    // onChange={(e) => {
                                    //     formData.name = e.target.value
                                    // }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="车位图片"
                                name="picture"
                                rules={[{ required: true, message: "请输入车位名称" }]} >

                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action="/camaro/v1/file"
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}>
                                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="价格（¥/天）"
                                name="rent_price"
                                rules={[{ required: true, message: "请输入价格" }]} >
                                <Input type="number" placeholder="例如：100"
                                    value={formData.rent_price}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, rent_price: Number(e.target.value) }))
                                    }
                                    // onChange={(e) => {
                                    //     formData.rent_price =  Number(e.target.value)
                                    //     console.log("rent_price:", formData.rent_price)
                                    // }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="地址"
                                name="location"
                                rules={[{ required: true, message: "请输入地址" }]} >
                                <Input placeholder="例如：北京市朝阳区 xxx" 
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                                    }
                                    // onChange={(e) =>{
                                    //     formData.location = e.target.value 
                                    // }}
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}
