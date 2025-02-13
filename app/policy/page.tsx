import React from 'react';
import Image from 'next/image';

export default function Policy() {
  return (
    <div className="container mx-none px-4 py-4">
      <h1 className="text-3xl font-bold text-center mb-12">政策</h1>
      
      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        {/* 左侧图片 */}
        <div className="relative">
          <Image 
            src="/other.jpeg" 
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

          <p className="text-gray-700 leading-relaxed">
            作为一个专业的车位租赁平台，我们致力于满足各类客户的车位租赁服务，我们都能为您提供合适的租赁方案。
          </p>
          <p className="text-gray-700 leading-relaxed">
            欢迎使用我们的车位租赁服务！为了确保您能够顺利、愉快地使用我们的服务，请仔细阅读以下政策内容：
          </p>
          <p className="text-gray-700 leading-relaxed">
            1. 租赁政策
            租赁期限：车位租赁期限从租赁生效开始，至租赁结束。租赁期满后，如需续租，请提前 [3] 天联系客服办理续租手续。
            提前解约：如需提前解约，需提前 [3] 天书面通知我们，并支付相应的违约金。违约金的具体金额请参考租赁合同。
          </p>
          <p className="text-gray-700 leading-relaxed">
            2. 费用标准
            租金：以在租赁系统首页地图上每个待租售的车位标价为准！
          </p>

        </div>
      </div>
    </div>
  );
}