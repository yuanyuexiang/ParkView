import React from 'react';
import Image from 'next/image';
import LegalSection from '../components/LegalSection';

// 用户协议内容
const USER_AGREEMENT = [
  { 
    id: 1, 
    content: '1. 服务范围：本平台提供车位租赁信息发布、在线预订及支付等服务。用户在使用本平台服务时应当遵守相关法律法规。' 
  },
  { 
    id: 2, 
    content: '2. 用户责任：用户应保证注册信息的真实性，并对账号安全负责。因账号被盗造成的损失由用户自行承担。' 
  },
  { 
    id: 3, 
    content: '3. 支付规则：用户应按照平台规定的方式和时间支付租金。如有逾期，平台有权收取滞纳金。' 
  },
  { 
    id: 4, 
    content: '4. 租赁管理：用户应遵守车位使用规范，不得将车位用于非法用途或转租。如有违规，平台有权终止服务。' 
  }
];

// 隐私政策内容
const PRIVACY_POLICY = [
  { 
    id: 1, 
    content: '1. 信息收集：我们收集用户的基本信息（姓名、联系方式）、车辆信息、支付信息等必要数据。' 
  },
  { 
    id: 2, 
    content: '2. 数据使用：收集的信息将用于提供服务、用户验证、支付处理、客户服务及系统优化。' 
  },
  { 
    id: 3, 
    content: '3. 信息安全：我们采用业界标准的加密技术和安全防护措施保护用户数据，防止未经授权的访问。' 
  },
  { 
    id: 4, 
    content: '4. 数据共享：除法律要求或获得用户授权外，我们不会向第三方分享用户个人信息。' 
  }
];

// 免责声明内容
const DISCLAIMER = [
  { 
    id: 1, 
    content: '1. 服务限制：本平台仅提供信息对接服务，不对车位的实际状况及使用承担责任。' 
  },
  { 
    id: 2, 
    content: '2. 系统维护：平台定期进行系统维护和升级，可能导致服务暂时中断，敬请谅解。' 
  },
  { 
    id: 3, 
    content: '3. 不可抗力：因自然灾害、网络故障等不可抗力导致的服务中断或损失，平台不承担责任。' 
  },
  { 
    id: 4, 
    content: '4. 争议处理：如发生租赁纠纷，平台将协助双方友好协商解决，但不承担法律责任。' 
  }
];

export default function Policy() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-12">政策与法律声明</h1>
      
      {/* 基本政策说明 */}
      <section className="grid md:grid-cols-2 gap-8 items-center mb-16">
        <div className="relative h-[400px]">
          <Image 
            src="/other.jpeg" 
            alt="公司大楼" 
            fill
            className="object-cover rounded-lg shadow-lg"
            priority
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">基本政策</h2>
          <p className="text-gray-700 leading-relaxed">
            车位租赁平台自上线以来，一直专注为广大客户提供优质、便捷的车位租赁服务。
          </p>
          <p className="text-gray-700 leading-relaxed">
            作为一个专业的车位租赁平台，我们致力于满足各类客户的车位租赁需求，为您提供最合适的租赁方案。
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">租赁规则</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>租期灵活，可选择月租或年租</li>
              <li>提前3天申请可办理续租手续</li>
              <li>如需提前解约，请提前3天通知</li>
              <li>租金按实际使用天数计算</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 法律声明部分 */}
      <section className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">法律声明</h2>
        <LegalSection title="用户协议" items={USER_AGREEMENT} />
        <LegalSection title="隐私政策" items={PRIVACY_POLICY} />
        <LegalSection title="免责声明" items={DISCLAIMER} />
      </section>
    </main>
  );
}