"use client";

import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import { Button } from 'antd';

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


    return (
        <div className="container mx-none px-4 py-0">
            <List
                itemLayout="vertical"
                size="large"
                header={
                    <div className='flex flex-row justify-between'>
                        <div className='mr-5'>车位列表（包括租用和自有）</div>
                        <Button type="primary" className='mr-5 bg-green-500'>+添加车位</Button>
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