import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img1.hscicdn.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'www.cricbuzz.com',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
