"use client";
// app/page.tsx
import { ConnectWallet } from "./ConnectButton";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-2xl text-green-500 p-8">专业车位租赁，竭诚为您服务！</h1>
      <div className="flex items-center p-8">
            <ConnectWallet />
      </div>
    </div>
  )
}