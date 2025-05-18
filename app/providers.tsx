"use client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig } from "wagmi";
import { http } from "viem";
import {
    mantleSepoliaTestnet,
    // mainnet,
    // polygon,
    // optimism,
    // arbitrum,
    // optimismSepolia,
    // bscTestnet,
    // baseGoerli,
} from "wagmi/chains";

/*
// 定义自定义链 MatrixNet
const matrixNet = {
    id: 1337, // 你需要确认 MatrixNet 的 Chain ID
    name: "MatrixNet",
    network: "matrixnet", 
    rpcUrls: {
        default: { http: ["https://ethereum.matrix-net.tech/"] },
        public: { http: ["https://ethereum.matrix-net.tech/"] },
    },
    nativeCurrency: {
        decimals: 18,
        name: "MatrixNet ETH",
        symbol: "ETH",
    },
    blockExplorers: {
        default: { 
            name: "MatrixNet Explorer", 
            url: "https://explorer.matrix-net.tech/" 
        },
    },
};
*/

// 定义 Westend Asset Hub (Polkadot 测试网)
const westendAssetHub = {
    id: 657, // Westend Asset Hub 的 Chain ID
    name: "Westend Asset Hub",
    network: "westend-asset-hub",
    nativeCurrency: {
        decimals: 18,
        name: "Westend",
        symbol: "WND",
    },
    rpcUrls: {
        default: { http: ["https://westend-asset-hub-eth-rpc.polkadot.io"] },
        public: { http: ["https://westend-asset-hub-eth-rpc.polkadot.io"] },
    },
    blockExplorers: {
        default: { 
            name: "Subscan", 
            url: "https://westend.subscan.io" 
        },
    },
    testnet: true,
};

// 定义 Moonbeam 网络 (Polkadot 的 EVM 兼容平行链)
const moonbeam = {
    id: 1284,
    name: "Moonbeam",
    network: "moonbeam",
    nativeCurrency: {
        decimals: 18,
        name: "Glimmer",
        symbol: "GLMR",
    },
    rpcUrls: {
        default: { http: ["https://rpc.api.moonbeam.network"] },
        public: { http: ["https://rpc.api.moonbeam.network"] },
    },
    blockExplorers: {
        default: { name: "Moonscan", url: "https://moonbeam.moonscan.io" },
    },
};

// 定义 Moonbase Alpha 测试网
const moonbaseAlpha = {
    id: 1287,
    name: "Moonbase Alpha",
    network: "moonbase-alpha",
    nativeCurrency: {
        decimals: 18,
        name: "DEV",
        symbol: "DEV",
    },
    rpcUrls: {
        default: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
        public: { http: ["https://rpc.api.moonbase.moonbeam.network"] },
    },
    blockExplorers: {
        default: {
            name: "Moonscan",
            url: "https://moonbase.moonscan.io",
        },
    },
    testnet: true,
};

const chains = [
    // mainnet, 
    // polygon, 
    // optimism, 
    // arbitrum,
    // matrixNet,
    moonbaseAlpha,   // Moonbase Alpha 测试网（默认）
    moonbeam,        // Moonbeam 主网
    westendAssetHub, // Westend Asset Hub (Polkadot 测试网)
    mantleSepoliaTestnet // 保留原网络作为备选
] as const;

const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";

const { connectors } = getDefaultWallets({
    appName: "ParkView",
    projectId,
});

const config = createConfig({
    chains,
    transports: {
        [mantleSepoliaTestnet.id]: http(),
        [moonbaseAlpha.id]: http(),
        [moonbeam.id]: http(),
        [westendAssetHub.id]: http(),
        // [mainnet.id]: http(),
        // [polygon.id]: http(),
        // [optimism.id]: http(),
        // [arbitrum.id]: http(),
        // [matrixNet.id]: http(),
        // [optimismSepolia.id]: http(),
        // [bscTestnet.id]: http(),
        // [baseGoerli.id]: http(),
    },
    ssr: true,
    connectors,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient} >
                <RainbowKitProvider locale="zh-CN" initialChain={moonbaseAlpha}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
