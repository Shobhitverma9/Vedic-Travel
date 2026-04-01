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
                // VedicTravel Brand Colors (from logo)
                saffron: {
                    DEFAULT: '#FF5722',
                    light: '#FF7043',
                    dark: '#E64A19',
                },
                purple: {
                    DEFAULT: '#7B2CBF',
                    light: '#9D4EDD',
                    dark: '#5A189A',
                },
                cream: {
                    DEFAULT: '#FFF8F3',
                    light: '#FFFCFA',
                },
                deepBlue: {
                    DEFAULT: '#1A2332',
                    light: '#2C3E50',
                },
                skyBlue: {
                    DEFAULT: '#4A6FA5',
                    light: '#6B8FC7',
                },
                gold: {
                    DEFAULT: '#D4AF37',
                    light: '#E5C558',
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
                display: ['var(--font-display)', 'Playfair Display', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-in-out',
                'slide-up': 'slideUp 0.6s ease-out',
                'glow': 'glow 2s ease-in-out infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                glow: {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
                    '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
            },

        },
    },
    plugins: [],
};

export default config;
