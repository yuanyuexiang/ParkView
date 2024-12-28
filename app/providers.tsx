"use client";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    // optimismSepolia,
    // bscTestnet,
    // baseGoerli,
} from "wagmi/chains";
import { http } from "viem";
import { createConfig } from "wagmi";

const chains = [mainnet, polygon, optimism, arbitrum] as const;

const projectId = "3fbb6bba6f1de962d911bb5b5c9dba88";

const { connectors } = getDefaultWallets({
    appName: "Web3 Demo",
    projectId,
});

const config = createConfig({
    chains,
    transports: {
        [mainnet.id]: http(),
        [polygon.id]: http(),
        [optimism.id]: http(),
        [arbitrum.id]: http(),
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
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider locale="zh-CN">
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
