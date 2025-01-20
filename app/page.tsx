"use client";
// app/page.tsx
import { ConnectWallet } from "./components/ConnectButton";
import Image from "next/image";

export default function Home() {
    return (
        <main className="min-h-full bg-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* 头部区域 */}
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-2">
                        <Image
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMEMyNC44MzY2IDAgMzIgNy4xNjM0NCAzMiAxNkMzMiAyNC44MzY2IDI0LjgzNjYgMzIgMTYgMzJDNy4xNjM0NCAzMiAwIDI0LjgzNjYgMCAxNkMwIDcuMTYzNDQgNy4xNjM0NCAwIDE2IDBaTTE2IDEwQzEyLjY4NjMgMTAgMTAgMTIuNjg2MyAxMCAxNkMxMCAxOS4zMTM3IDEyLjY4NjMgMjIgMTYgMjJDMTkuMzEzNyAyMiAyMiAxOS4zMTM3IDIyIDE2QzIyIDEyLjY4NjMgMTkuMzEzNyAxMCAxNiAxMFoiIGZpbGw9IiMwMDU2RkYiLz48L3N2Zz4="
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                        <span className="text-xl font-bold">Web3 Demo</span>
                    </div>
                    {/* <ConnectWallet /> */}
                </div>

                {/* 主要内容 */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">
                        Next.js Web3 Template
                    </h1>
                    <p className="text-gray-600">
                        基于 Next.js、TailwindCSS 和 RainbowKit 构建的 Web3
                        应用模板，支持多链和多钱包连接。
                    </p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                            开始使用
                        </button>
                        <button className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200 transition-colors">
                            了解更多
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
