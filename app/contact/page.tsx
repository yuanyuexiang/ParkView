import React from 'react';
import Image from 'next/image';

// 定义团队成员接口
interface TeamMember {
  name: string;
  role: string;
  image: string;
}

// 团队成员数据
const teamMembers: TeamMember[] = [
  {
    name: "张三",
    role: "创始人 & CEO",
    image: "/member.webp"
  },
  {
    name: "李四",
    role: "技术总监",
    image: "/member.webp"
  },
  {
    name: "王五",
    role: "运营总监",
    image: "/member.webp"
  }
];

export default function About() {
  return (
    <div className="container mx-auto px-4 py-4">
      {/* 团队介绍 */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">核心团队</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-40 h-40 mx-auto mb-6">
                <Image 
                  src={member.image}
                  alt={member.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-12">关于我们</h1>
      
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        {/* 左侧图片 */}
        <div className="relative">
          <Image 
            src="/map.png" 
            alt="公司大楼" 
            width={800}
            height={800}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* 右侧文字内容 */}
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            车位租赁平台自上线以来，一直专注为广大客户提供优质、便捷的车位租赁服务。
          </p>
          <p className="text-gray-700 leading-relaxed bold-text">
            感谢您选择我们的车位租赁服务！如果您在使用过程中有任何疑问或需要帮助，请随时通过以下方式联系我们。
          </p>
          <p className="text-gray-700 leading-relaxed">
            客服热线：400-123-4567。
            工作时间：周一至周日，9:00 - 21:00
          </p>
          <p className="text-gray-700 leading-relaxed">
            我们致力于为您提供最优质的服务，您的满意是我们最大的动力。期待您的联系！
          </p>
        </div>
      </div>
    </div>
  );
}