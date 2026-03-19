import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Ocean depths palette
                ocean: {
                    midnight: "#040b14",
                    deep: "#0a1628",
                    dark: "#0f1d32",
                    base: "#0d2137",
                    surface: "#132d4a",
                },
                // Teal wave accents
                teal: {
                    deep: "#0e4d5e",
                    DEFAULT: "#1a8a9e",
                    bright: "#2bb5cc",
                    light: "#5ccfdf",
                    glow: "#7eeaf5",
                },
                // Gold accents
                gold: {
                    dark: "#8b7328",
                    DEFAULT: "#c9a84c",
                    bright: "#d4af37",
                    light: "#f5d569",
                    shimmer: "#ffe599",
                },
                // Legacy compat
                primary: {
                    dark: "#040b14",
                    secondary: "#0d2137",
                },
                accent: {
                    neon: "#2bb5cc",
                    purple: "#1a8a9e",
                    gold: "#d4af37",
                    orange: "#c9a84c",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Cinzel", "Poppins", "system-ui", "serif"],
                elegant: ["Cormorant Garamond", "Georgia", "serif"],
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in",
                "slide-up": "slideUp 0.6s ease-out",
                "glow-pulse": "glowPulse 2s ease-in-out infinite",
                "float": "float 3s ease-in-out infinite",
                "wave": "wave 8s ease-in-out infinite",
                "wave-slow": "wave 12s ease-in-out infinite",
                "ripple": "ripple 1.5s ease-out",
                "bubble": "bubbleFloat 10s ease-in-out infinite",
                "gold-shimmer": "goldShimmer 3s ease-in-out infinite",
                "ocean-gradient": "oceanGradient 15s ease infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                glowPulse: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(43,181,204,0.4)" },
                    "50%": { boxShadow: "0 0 40px rgba(43,181,204,0.7), 0 0 60px rgba(212,175,55,0.3)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                wave: {
                    "0%, 100%": { transform: "translateX(0) translateY(0)" },
                    "25%": { transform: "translateX(-5px) translateY(-3px)" },
                    "50%": { transform: "translateX(0) translateY(-5px)" },
                    "75%": { transform: "translateX(5px) translateY(-3px)" },
                },
                ripple: {
                    "0%": { transform: "scale(0)", opacity: "0.6" },
                    "100%": { transform: "scale(4)", opacity: "0" },
                },
                bubbleFloat: {
                    "0%": { transform: "translateY(100vh) scale(0)", opacity: "0" },
                    "10%": { opacity: "0.6" },
                    "90%": { opacity: "0.3" },
                    "100%": { transform: "translateY(-10vh) scale(1)", opacity: "0" },
                },
                goldShimmer: {
                    "0%": { backgroundPosition: "-200% center" },
                    "100%": { backgroundPosition: "200% center" },
                },
                oceanGradient: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            backgroundImage: {
                "ocean-gradient": "linear-gradient(-45deg, #040b14, #0d2137, #0e4d5e, #0a1628, #040b14)",
            },
        },
    },
    plugins: [],
};

export default config;
