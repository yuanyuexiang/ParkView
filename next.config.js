/*
 * @Author: 齐大胜 782395122@qq.com
 * @Date: 2024-12-28 20:00:04
 * @LastEditors: 齐大胜 782395122@qq.com
 * @LastEditTime: 2024-12-28 20:13:08
 * @FilePath: /park-view1/next.config.js
 * @Description:
 *
 * Copyright (c) 2024 by 齐大胜 email: 782395122@qq.com, All Rights Reserved.
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy:
            "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            "pino-pretty": false,
        };
        return config;
    },
};

module.exports = nextConfig;
