// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#534AB7',
          50: '#EEEDFE',
          100: '#CECBF6',
          200: '#AFAAEE',
          300: '#8F88E2',
          400: '#716AD0',
          500: '#534AB7',
          600: '#473FA0',
          700: '#3A3386',
          800: '#26215C',
        },
        info: {
          50: '#E6F1FB',
          800: '#185FA5',
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // 분석 중 화면: 사진 위를 오르내리는 스캔 바
        "scan-sweep": {
          "0%": { transform: "translateY(-40px)" },
          "100%": { transform: "translateY(240px)" },
        },
        "dot-blink": {
          "0%, 60%, 100%": { opacity: "0.2" },
          "30%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scan-sweep": "scan-sweep 1.8s ease-in-out infinite alternate",
        "dot-blink": "dot-blink 1.2s infinite",
      },
      // tailwind.config.js의 theme.extend에 추가
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};