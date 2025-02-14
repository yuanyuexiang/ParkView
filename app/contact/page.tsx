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

export default function Contact() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">联系我们</h1>

      <div className="max-w-4xl mx-auto">
        {/* 联系信息卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左侧联系信息 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">客服热线</h2>
                <p className="text-xl text-blue-600">400-XXX-XXXX</p>
                <p className="text-gray-600 mt-2">周一至周日 9:00-18:00</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">电子邮箱</h2>
                <p className="text-blue-600">support@parking.com</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">公司地址</h2>
                <p className="text-gray-600">深圳市南山区科技园</p>
              </div>
            </div>

            {/* 右侧图片 */}
            <div className="relative h-[300px]">
              <Image
                src="/contact.jpg"
                alt="客服中心"
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* 在线留言表单 */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">在线留言</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">姓名</label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的姓名"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">联系电话</label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的联系电话"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-gray-700 mb-2">留言内容</label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入您的留言内容"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              提交留言
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}