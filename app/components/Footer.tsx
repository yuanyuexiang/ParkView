import React from 'react';

interface FooterProps {
  companyEmail?: string;
  phoneNumber?: string;
}

export default function Footer({ 
  companyEmail = '8888888@qq.com',
  phoneNumber = '188-8888-8888'
}: FooterProps) {
  return (
    <footer className="bg-white py-1 border-t mt-auto">
      <div className="container mx-auto px-4">
        {/* 版权信息 */}
        <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t">
          <p>© Copyright 2002-2024, PARKING.COM, Inc.All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
} 