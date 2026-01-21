import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "IPL Auction 2026 - Live Auction System",
    description: "Real-time IPL Auction Simulation Platform for offline auction events",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
