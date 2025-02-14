'use client';
import React from 'react';
import Image from 'next/image';

// 定义公司数据类型
interface CompanyStats {
  label: string;
  value: string;
}

export default function About() {
  // 公司统计数据
  const stats: CompanyStats[] = [
    { label: "服务客户", value: "50,000+" },
    { label: "车辆数量", value: "1,000+" },
    { label: "服务城市", value: "10+" },
    { label: "成立年限", value: "1" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* 主标题部分 */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">重新定义车位租赁体验</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          我们致力于打造去中心化的车位租赁生态系统，通过区块链技术为用户提供透明、安全、高效的Web3出行服务
        </p>
      </div>

      {/* 统计数据展示 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-gray-600 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 使命愿景部分 - 在统计数据之后添加 */}
      <div className="mb-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-4 text-blue-600">使命</h3>
            <p className="text-gray-700">
              连接传统租车与Web3世界，构建去中心化的车位资产流通新范式
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-4 text-green-600">愿景</h3>
            <p className="text-gray-700">
              打造高确定性的Web3出行生态系统，成为全球领先的去中心化车位资产管理平台
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-bold mb-4 text-purple-600">价值观</h3>
            <p className="text-gray-700">
              诚信、创新、专业、共赢
            </p>
          </div>
        </div>
      </div>

      {/* 泊车链介绍 - 在公司介绍之前添加 */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">泊车链技术</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            引领行业革新，打造智能租车新生态
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">区块链技术</h3>
              <p className="text-gray-700">
                采用先进的区块链技术，确保交易透明和数据安全，为用户提供可信赖的租车服务平台。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">智能合约</h3>
              <p className="text-gray-700">
                通过智能合约自动化处理租赁流程，提高效率的同时确保交易的公平性和安全性。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-blue-600">数字身份</h3>
              <p className="text-gray-700">
                创新的数字身份认证系统，为用户提供安全便捷的身份验证和信用评估。
              </p>
            </div>
          </div>
          <div className="relative h-[400px]">
            <Image 
              src="/web3jishu.webp" 
              alt="泊车链技术" 
              fill
              priority
              className="object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* 公司介绍部分 */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-[500px]">
          <Image 
            src="/zongbu.jpeg" 
            alt="公司总部" 
            fill
            className="object-cover rounded-lg shadow-xl"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold mb-6">我们的故事</h2>
          <p className="text-gray-700 leading-relaxed">
            成立于2024年，始终坚持"用户至上"的服务理念。我们拥有业内领先的车位管理系统和专业的服务团队，为客户提供全方位的租车位解决方案。
          </p>
          <p className="text-gray-700 leading-relaxed">
            从最初的几十个车位发展到如今覆盖全国的租赁网络，我们始终不忘初心，持续创新，为打造中国最值得信赖的车位租赁品牌而不懈努力。
          </p>
        </div>
      </div>


    </div>
  );
}