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
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        serif: ['Inter', 'sans-serif'],
      },
      colors: {
        // Uploaded Palette:
        // Top: #3B1E4A (Deep Velvet Plum)
        // Mid: #7B3B6D (Rich Plum Berry)
        // Warm: #ED9477 (Sunset Coral / Peach)
        // Gold: #FBC67C (Sunset Amber / Apricot)
        velvet: {
          950: '#120817',
          900: '#1C0D24',
          800: '#271233',
          700: '#351845',
          600: '#432354',
          500: '#5A2A6B',
        },
        plum: {
          900: '#3D1B36',
          800: '#54264A',
          700: '#6B315F',
          600: '#80386C',
          500: '#9B4584',
          400: '#B65A9E',
          300: '#D47FBE',
        },
        coral: {
          50:  '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD3C7',
          300: '#FBB3A0',
          400: '#F59E85',
          500: '#ED9477', // Primary swatch
          600: '#DF7B5B',
          700: '#C75F3E',
          800: '#A44828',
          900: '#83371D',
        },
        apricot: {
          100: '#FFF2DB',
          200: '#FFE3B8',
          300: '#FFD392',
          400: '#FDC477',
          500: '#FBC67C', // Gold swatch
          600: '#E8A752',
          700: '#C7832F',
        },
        primary: {
          50:  '#FFF5F2',
          100: '#FFE8E2',
          200: '#FFD3C7',
          300: '#FBB3A0',
          400: '#F59E85',
          500: '#ED9477',
          600: '#DF7B5B',
          700: '#80386C',
          800: '#432354',
          900: '#271233',
          950: '#140A1A',
        },
        sif: {
          high:        '#FF5C6C',
          medium:      '#FBC67C',
          low:         '#34D399',
          darkBg:      '#140A1A',
          darkCard:    '#220E2C',
          darkBorder:  '#4A2359',
          accent:      '#ED9477',
          gold:        '#FBC67C',
        },
      },
      animation: {
        'radar':        'radarSweep 3s linear infinite',
        'radar-ping':   'radarPing 2.5s ease-out infinite',
        'hazard':       'hazardPulse 2s ease-in-out infinite',
        'float':        'floatY 3s ease-in-out infinite',
        'float-slow':   'floatSlow 4.5s ease-in-out infinite',
        'fade-up':      'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right':  'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'loader-bar':   'loaderProgress 1.8s ease-in-out infinite',
        'shimmer':      'shimmer 1.8s linear infinite',
        'scan':         'scanLine 3.5s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2.5s ease-in-out infinite',
        'border-flow':  'borderFlow 4s linear infinite',
      },
      keyframes: {
        radarSweep:    { from: { transform: 'rotate(0deg)'   }, to: { transform: 'rotate(360deg)' } },
        radarPing:     { '0%': { transform: 'scale(0.8)', opacity: '0.9' }, '70%': { transform: 'scale(2.2)', opacity: '0.15' }, '100%': { transform: 'scale(2.8)', opacity: '0' } },
        hazardPulse:   { '0%,100%': { boxShadow: '0 0 0 0 rgba(237,148,119,0.5)' }, '50%': { boxShadow: '0 0 0 12px rgba(237,148,119,0)' } },
        pulseGlow:     { '0%,100%': { opacity: '0.9', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.02)', filter: 'drop-shadow(0 0 12px rgba(237,148,119,0.4))' } },
        floatY:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        floatSlow:     { '0%,100%': { transform: 'translateY(0) scale(1)' }, '50%': { transform: 'translateY(-8px) scale(1.02)' } },
        fadeUp:        { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight:  { from: { opacity: '0', transform: 'translateX(14px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        loaderProgress:{ '0%': { transform: 'translateX(-100%)' }, '50%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(110%)' } },
        shimmer:       { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        scanLine:      { '0%': { top: '-2px', opacity: '0.8' }, '80%': { top: '102%', opacity: '0.5' }, '100%': { top: '102%', opacity: '0' } },
        borderFlow:    { '0%, 100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
      },
      boxShadow: {
        'coral-glow': '0 0 25px rgba(237,148,119,0.35)',
        'gold-glow':   '0 0 25px rgba(251,198,124,0.35)',
        'plum-glow':   '0 0 25px rgba(128,56,108,0.4)',
        'card-sunset': '0 8px 32px -4px rgba(18,8,23,0.7), 0 0 16px rgba(128,56,108,0.15)',
      },
    },
  },
  plugins: [],
}
