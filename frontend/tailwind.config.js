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
        serif: ['Inter', 'sans-serif'], // override – never Times New Roman
      },
      colors: {
        primary: {
          50:  '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        sif: {
          high:        '#EF4444',
          medium:      '#F59E0B',
          low:         '#10B981',
          darkBg:      '#080C14',
          darkCard:    '#0D131F',
          darkBorder:  '#1E293B',
          accent:      '#38BDF8',
          accentDeep:  '#0284C7',
        },
      },
      animation: {
        'radar':        'radarSweep 3s linear infinite',
        'radar-ping':   'radarPing 2s ease-out infinite',
        'hazard':       'hazardPulse 2s ease-in-out infinite',
        'float':        'floatY 2.8s ease-in-out infinite',
        'fade-up':      'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'slide-right':  'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both',
        'loader-bar':   'loaderProgress 1.8s ease-in-out infinite',
        'shimmer':      'shimmer 1.6s linear infinite',
        'scan':         'scanLine 4s ease-in-out infinite',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'conf-fill':    'barFill 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        radarSweep:    { from: { transform: 'rotate(0deg)'   }, to: { transform: 'rotate(360deg)' } },
        radarPing:     { '0%': { transform: 'scale(0.8)', opacity: '0.9' }, '70%': { transform: 'scale(2.2)', opacity: '0.15' }, '100%': { transform: 'scale(2.8)', opacity: '0' } },
        hazardPulse:   { '0%,100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' }, '50%': { boxShadow: '0 0 0 10px rgba(239,68,68,0)' } },
        floatY:        { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        fadeUp:        { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight:  { from: { opacity: '0', transform: 'translateX(14px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        loaderProgress:{ '0%': { transform: 'translateX(-100%)' }, '50%': { transform: 'translateX(0%)' }, '100%': { transform: 'translateX(110%)' } },
        shimmer:       { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        scanLine:      { '0%': { top: '-2px', opacity: '0.7' }, '80%': { top: '102%', opacity: '0.4' }, '100%': { top: '102%', opacity: '0' } },
        barFill:       { from: { width: '0%' }, to: { width: 'var(--bar-width, 50%)' } },
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0.5H40M0.5 0V40' stroke='%231E293B' stroke-opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'sky-glow':   '0 0 20px rgba(56,189,248,0.2)',
        'red-glow':   '0 0 20px rgba(239,68,68,0.2)',
        'card':       '0 4px 24px -4px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
