import React from 'react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-none px-4 py-4">
      <h1 className="text-3xl font-bold text-center mb-12">我的车位</h1>
      
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        {/* 左侧图片 */}
        <div className="relative">
          <Image 
            src="/about.jpg" 
            alt="公司大楼" 
            width={80}
            height={80}
            className="w-full h-[400px] object-cover rounded-lg shadow-lg"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded">
            载图(Alt + A)
          </div>
        </div>

        {/* 右侧文字内容 */}
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            我们的车位屌啊，用户都说好啊！
          </p>
        </div>
      </div>
    </div>
  );
}