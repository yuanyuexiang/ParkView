"use client";

import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import { Button } from 'antd';

import { useWriteContract } from "wagmi";
import abi from "@/app/abi/ParkingLot.json"; // ✅ 正确导入 ABI

export default function About() {

    const data = Array.from({ length: 8 }).map((_, i) => ({
        title: `我自己的车位 ${i}`,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
        description: '这是我的车位，我可以随时出租给别人。',
        content: '这是我的车位，我可以随时出租给别人。这是我的车位，我可以随时出租给别人。这是我的车位，我可以随时出租给别人。',
    }));
    
    const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
        <Space>
            {React.createElement(icon)}
            {text}
        </Space>
    );

    const contractAddress = "0x05C0a833D158E97484F6887D42f92eC3807c4A49";
    const { data: hash, isPending, writeContract } = useWriteContract();

    // 车位所有者地址
    const toAddress = "0xadA778c33B4CA3f5374D410396b84DE2B08CC567";
    // 车位位置
    const location = "北京市朝阳区";

    // 添加车位
    const addParkingSpot = async () => {
        try {
            writeContract({
                address: contractAddress,
                abi,
                functionName: "mint",
                args: [
                    toAddress, 
                    location, 
                    BigInt(12), 
                    116.397428, 
                    39.91923
                ],
            });
      
            alert("Mint 成功！");
        } catch (error) {
            console.error("Mint 失败", error);
            alert("Mint 失败：" + error);
        }

        console.log('addParkingSpot');
    }

    return (
        <div className="container mx-none px-4 py-0">
            <List
                itemLayout="vertical"
                size="large"
                header={
                    <div className='flex flex-row justify-between'>
                        <div className='mr-5'>车位列表（包括租用和自有）</div>
                        <Button type="primary" className='mr-5 bg-green-500' onClick={addParkingSpot}>+添加车位</Button>
                    </div>
                }
                pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }
                }
                dataSource={data}
                // footer={
                //     <div>
                //         <b>ant design</b> footer part
                //     </div>
                // }
                renderItem={(item) => (
                <List.Item
                    key={item.title}
                    actions={[
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                    ]}
                    extra={
                        <img
                            width={202}
                            alt="logo"
                            src="/tcw.jpg"
                        />
                    }>
                    
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={item.title}
                        description={item.description} />
                    {item.content}
                </List.Item>
                )}
            />
        </div>
    );
}