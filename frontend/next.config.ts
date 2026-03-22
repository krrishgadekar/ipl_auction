import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    outputFileTracingRoot: path.join(__dirname, '../'),
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
