import React from 'react';
import Image from 'next/image';

export default function About() {
  return (
    <div className="container mx-none px-4 py-4">
      <h1 className="text-3xl font-bold text-center mb-12">关于我们</h1>
      
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
            汽车租赁有限公司，自成立以来，一直专注为广大客户提供优质、便捷的汽车租赁服务。
          </p>
          
          <p className="text-gray-700 leading-relaxed">
            作为一家专业的汽车租赁公司，我们致力于满足各类客户的出行需求，无论是商务出行、旅游度假
            还是日常通勤，我们都能为您提供合适的租赁方案。
          </p>

          <p className="text-gray-700 leading-relaxed">
            公司拥有丰富的车型选择，从经济型到豪华型，从新车到商务车，应有尽有，以满足不同客
            户的个性化需求。我们注重车辆维护和保养，确保每一辆车都保持良好的性能和舒适度，让您的驾
            驶之旅更加安全、舒心。
          </p>

          <p className="text-gray-700 leading-relaxed">
            在服务方面，我们始终以客户为中心，提供24小时客服热线，随时为您解答疑惑和处理问
            题。我们的专业团队将竭诚为您提供全程无忧的租车体验，让您的每一次出行都成为美好回忆。
          </p>

        </div>
      </div>

      {/* 服务特点 */}
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-car text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-3">车位齐全</h3>
          <p className="text-gray-600">从经济型到豪华型，满足各类需求</p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-headset text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-3">24小时服务</h3>
          <p className="text-gray-600">全天候客服支持，随时解答您的疑问</p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-alt text-white text-2xl"></i>
          </div>
          <h3 className="text-xl font-semibold mb-3">安全保障</h3>
          <p className="text-gray-600">定期维护保养，确保行车安全</p>
        </div>
      </div>

      {/* 联系信息 */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-8">联系我们</h2>
        <div className="flex justify-center space-x-12">
          <div>
            <i className="fas fa-phone-alt text-green-500 text-2xl mb-2"></i>
            <p className="text-gray-600">24小时服务热线</p>
            <p className="text-xl font-bold text-green-500">188-8888-8888</p>
          </div>
          <div>
            <i className="fas fa-envelope text-green-500 text-2xl mb-2"></i>
            <p className="text-gray-600">企业邮箱</p>
            <p className="text-xl font-bold text-green-500">8888888@qq.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}