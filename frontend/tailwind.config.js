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
        // High-Contrast Luxury Palette:
        // 1. Black: #000000
        // 2. Cobalt Blue Deep: #2C3480 (RGB: 44, 52, 128)
        // 3. White: #FFFFFF
        cobalt: {
          50:  '#EEF1FA',
          100: '#DCE1F5',
          200: '#BAC4EB',
          300: '#8B9DE0',
          400: '#5B73D1',
          500: '#3D48A3',
          600: '#2C3480', // Exact User Swatch #2C3480
          700: '#222867',
          800: '#181D4E',
          900: '#0F1336',
          950: '#07091D',
        },
        dark: {
          950: '#000000', // Pure Black
          900: '#05070D',
          850: '#0A0D18',
          800: '#0F1424',
          700: '#161D33',
        },
        primary: {
          50:  '#EEF1FA',
          100: '#DCE1F5',
          200: '#BAC4EB',
          300: '#8B9DE0',
          400: '#5B73D1',
          500: '#3D48A3',
          600: '#2C3480',
          700: '#222867',
          800: '#181D4E',
          900: '#0F1336',
          950: '#000000',
        },
        sif: {
          high:        '#FF3B30',
          medium:      '#FF9500',
          low:         '#34C759',
          darkBg:      '#000000',
          darkCard:    '#070A14',
          darkBorder:  '#2C3480',
          accent:      '#2C3480',
          cobaltGlow:  '#4E5BC9',
        },
      },
      animation: {
        'radar':        'radarSweep 2.5s linear infinite',
        'radar-ping':   'radarPing 2s ease-out infinite',
        'hazard':       'hazardPulse 1.8s ease-in-out infinite',
        'float':        'floatY 3s ease-in-out infinite',
        'fade-up':      'fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right':  'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'loader-bar':   'loaderProgress 1.6s ease-in-out infinite',
        'scan':         'scanLine 3s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 2.2s ease-in-out infinite',
        'electric-border': 'electricBorder 3s linear infinite',
      },
      keyframes: {
        radarSweep:    { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        radarPing:     { '0%': { transform: 'scale(0.8)', opacity: '0.9' }, '70%': { transform: 'scale(2.3)', opacity: '0.15' }, '100%': { transform: 'scale(2.9)', opacity: '0' } },
        hazardPulse:   { '0%,100%': { boxShadow: '0 0 0 0 rgba(44,52,128,0.7)' }, '50%': { boxShadow: '0 0 0 14px rgba(44,52,128,0)' } },
        pulseGlow:     { '0%,100%': { boxShadow: '0 0 15px rgba(44,52,128,0.4)' }, '50%': { boxShadow: '0 0 30px rgba(78,91,201,0.7), 0 0 10px rgba(255,255,255,0.4)' } },
        floatY:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        fadeUp:        { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight:  { from: { opacity: '0', transform: 'translateX(14px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        loaderProgress:{ '0%': { transform: 'translateX(-100%)' }, '50%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(110%)' } },
        scanLine:      { '0%': { top: '-2px', opacity: '0.9' }, '80%': { top: '102%', opacity: '0.6' }, '100%': { top: '102%', opacity: '0' } },
      },
      boxShadow: {
        'cobalt-glow': '0 0 25px rgba(44,52,128,0.55), 0 0 50px rgba(44,52,128,0.25)',
        'cobalt-intense': '0 0 35px rgba(78,91,201,0.65), 0 0 70px rgba(44,52,128,0.35)',
        'white-subtle': '0 0 15px rgba(255,255,255,0.25)',
      },
    },
  },
  plugins: [],
}
