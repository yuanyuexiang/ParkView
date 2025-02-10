"use client";

import React, { useCallback,useState,useEffect } from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import { Button } from 'antd';

import abi from "@/app/abi/ParkingLot.json"; // ✅ 正确导入 ABI

import { useAccount,useWriteContract ,useWaitForTransactionReceipt } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function MyParking() {

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

    const contractAddress = "0xf2d614ba26148ed5e2d03934b7dcc16d02c6b47f";
    const { writeContractAsync } = useWriteContract();
    const { isConnected } = useAccount();
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined); // ✅ 使用 undefined 而不是 null

    // 监听交易完成
    const { data: receipt, isError, error } = useWaitForTransactionReceipt({
        hash: txHash, // 监听的交易哈希
    });

    /**
     * 打开连接钱包的模态框
     */
    const { openConnectModal } = useConnectModal();

    // 车位所有者地址
    //const toAddress = "0xadA778c33B4CA3f5374D410396b84DE2B08CC567";
    // 车位位置
    const location = "北京市朝阳区";

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
                args:  [
                    location, 
                    12, 
                    116, // 转换成整数
                    39   // 转换成整数
                ],
            });
            setTxHash(txHash as `0x${string}`); // ✅ 这里不会报错
            console.log("Mint 成功", txHash,);
            //alert("Mint 成功！交易哈希：");
        } catch (error) {
            console.error("Mint 失败", error);
            //alert("Mint 失败：" + error);
        }
      }, [isConnected, writeContractAsync, openConnectModal]);

    // 监听交易是否完成
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