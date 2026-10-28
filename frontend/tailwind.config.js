/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        // Visual Direction — Master Palette
        midnight: '#070B14',      // Deepest background
        navy: {
          950: '#05080F',
          900: '#070B14',
          850: '#0A0F1D',
          800: '#0D1424',        // Deep navy surface
          750: '#111A2E',
          700: '#15213A',
          600: '#1E2F52',
          500: '#2A406C',
        },
        cyan: {
          400: '#26EAFF',
          500: '#00E5FF',        // Electric cyan
          600: '#00B8CC',
          700: '#008C99',
          950: '#00252B',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',        // AI violet
          600: '#7C3AED',
          700: '#6D28D9',
          950: '#1E0E3E',
        },
        amber: {
          400: '#FFC04D',
          500: '#FFB020',        // Safety amber
          600: '#E0940B',
          950: '#331F00',
        },
        critical: {
          400: '#FF6B78',
          500: '#FF4757',        // Critical red
          600: '#E02636',
          950: '#33080C',
        },
        success: {
          400: '#4DF5B3',
          500: '#2EE59D',        // Success green
          600: '#1EB879',
          950: '#062B1C',
        },
        text: {
          primary: '#F4F7FB',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        sif: {
          high: '#FF4757',
          medium: '#FFB020',
          low: '#2EE59D',
          card: '#0D1424',
          border: 'rgba(0, 229, 255, 0.2)',
        }
      },
      animation: {
        'core-spin': 'coreSpin 20s linear infinite',
        'core-reverse': 'coreReverse 16s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'laser-scan': 'laserScan 3.5s ease-in-out infinite',
        'float-slow': 'floatSlow 4.5s ease-in-out infinite',
        'particle-flow': 'particleFlow 8s linear infinite',
        'radar-sweep': 'radarSweep 3s linear infinite',
        'shimmer-fast': 'shimmerFast 2s linear infinite',
      },
      keyframes: {
        coreSpin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        coreReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)', filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.4))' },
          '50%': { opacity: '1', transform: 'scale(1.02)', filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.75))' },
        },
        laserScan: {
          '0%': { top: '-2%', opacity: '0.8' },
          '80%': { top: '102%', opacity: '0.5' },
          '100%': { top: '102%', opacity: '0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        radarSweep: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        shimmerFast: {
          '0%': { backgroundPosition: '-300px 0' },
          '100%': { backgroundPosition: '300px 0' },
        },
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(0, 229, 255, 0.35)',
        'cyan-intense': '0 0 40px rgba(0, 229, 255, 0.65), 0 0 80px rgba(0, 229, 255, 0.25)',
        'violet-glow': '0 0 25px rgba(139, 92, 246, 0.35)',
        'violet-intense': '0 0 40px rgba(139, 92, 246, 0.65), 0 0 80px rgba(139, 92, 246, 0.25)',
        'cinematic': '0 16px 48px -8px rgba(0, 0, 0, 0.75), 0 0 1px 1px rgba(0, 229, 255, 0.15)',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0.5H40M0.5 0V40' stroke='%2300E5FF' stroke-opacity='0.04'/%3E%3C/svg%3E\")",
        'dots-pattern': "url(\"data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%238B5CF6' fill-opacity='0.08'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}

