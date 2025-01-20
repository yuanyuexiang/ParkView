'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'

interface MenuItem {
  path: string
  label: string
}

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems: MenuItem[] = [
    { path: '/', label: '总览' },
    { path: '/my-rentals', label: '我的租赁' },
    { path: '/my-parkings', label: '我的车位' },
    { path: '/profile', label: '我的' }
  ]

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              停车位租赁
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`hover:text-blue-600 transition-colors ${
                  pathname === item.path ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ConnectButton />
          </div>

          <div className="flex items-center md:hidden">
            <ConnectButton />
            <button
              className="ml-2 p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuOutlined className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
      >
        <div className="flex flex-col space-y-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`hover:text-blue-600 transition-colors ${
                pathname === item.path ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Drawer>
    </header>
  )
} 