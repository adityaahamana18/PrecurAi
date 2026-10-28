/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sif: {
          high: '#EF4444',       // Red for High SIF
          medium: '#F59E0B',     // Amber/Orange for Medium SIF
          low: '#10B981',        // Green for Low SIF
          darkBg: '#0F172A',     // Slate-900
          darkCard: '#1E293B',   // Slate-800
          darkBorder: '#334155', // Slate-700
          lightBg: '#F8FAFC',    // Slate-50
          lightCard: '#FFFFFF',  // White
          lightBorder: '#E2E8F0',// Slate-200
          accent: '#0284C7',     // Sky-600
          accentHover: '#0369A1'
        }
      },
      animation: {
        'bounce-subtle': 'floatGentle 2.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
