import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  future: {
    // Hover styles only apply on devices that can actually hover (no sticky hover on phones).
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Sora', 'Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ink: {
          950: '#05040d',
          900: '#0b0a1a',
          800: '#13112a',
          700: '#1c1940',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(139,92,246,0.35), 0 12px 40px -10px rgba(99,102,241,0.75)',
        'glow-lg': '0 0 0 1px rgba(139,92,246,0.5), 0 18px 60px -10px rgba(99,102,241,0.95)',
        'glow-x': '0 0 0 1px rgba(103,232,249,0.35), 0 0 32px -6px rgba(34,211,238,0.65)',
        'glow-o': '0 0 0 1px rgba(240,171,252,0.35), 0 0 32px -6px rgba(217,70,239,0.65)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.95)' },
        },
        pop: {
          '0%': { transform: 'scale(0.55)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'win-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.045)' },
        },
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'confetti-fall': {
          '0%': { transform: 'translate3d(0, -10vh, 0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate3d(var(--drift), 110vh, 0) rotate(var(--spin))', opacity: '0.9' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        trophy: {
          '0%': { transform: 'scale(0) rotate(-25deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(8deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(-40px) rotate(-20deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(40px) rotate(20deg)', opacity: '0' },
          '100%': { transform: 'translateX(0) rotate(0deg)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out both',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 18s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        'win-pulse': 'win-pulse 1.2s ease-in-out infinite',
        shimmer: 'shimmer 4s linear infinite',
        'confetti-fall': 'confetti-fall linear both',
        'bounce-dot': 'bounce-dot 1.2s ease-in-out infinite',
        trophy: 'trophy 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-left': 'slide-left 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-right': 'slide-right 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'glow-pulse': 'glow-pulse 2.4s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out both',
      },
    },
  },
  plugins: [],
};
