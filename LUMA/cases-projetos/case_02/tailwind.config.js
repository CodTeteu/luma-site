/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                terracotta: {
                    50: '#FDF8F6',
                    100: '#FBEFEB',
                    200: '#F6DCD6',
                    300: '#F0C2B8',
                    400: '#E9A393',
                    500: '#E07A5F', // Primary
                    600: '#CC583B',
                    700: '#A83F25',
                    800: '#86321F',
                    900: '#68291A',
                },
                olive: {
                    50: '#F7f8f4',
                    100: '#EEF1E6',
                    200: '#DCE3CB',
                    300: '#C9D4AF',
                    400: '#A8B980',
                    500: '#889E53', // Primary Olive
                    600: '#6D7E42',
                    700: '#525F32',
                    800: '#434D2E',
                    900: '#384029',
                },
                cream: '#FDFBF7',
                stone: {
                    850: '#1c1917',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif'],
                script: ['"Great Vibes"', 'cursive'],
            },
            backgroundImage: {
                'paper-texture': "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
            },
            animation: {
                'fade-in': 'fadeIn 1s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
                'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
                'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
                'slide-up': 'slideUp 1s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 2s',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
                'scale-in': 'scaleIn 0.5s ease-out forwards',
                'rotate-slow': 'rotateSlow 20s linear infinite',
                'countdown-flip': 'countdownFlip 0.5s ease-in-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeInRight: {
                    '0%': { opacity: '0', transform: 'translateX(40px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(30px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.02)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                rotateSlow: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                countdownFlip: {
                    '0%': { transform: 'rotateX(0deg)' },
                    '50%': { transform: 'rotateX(-90deg)' },
                    '100%': { transform: 'rotateX(0deg)' },
                },
            }
        },
    },
    plugins: [],
}
