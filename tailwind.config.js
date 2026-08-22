/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Brand — a calm, technical teal-blue
        brand: {
          50: '#f0fbfc',
          100: '#d9f5f7',
          200: '#b3ebee',
          300: '#7fd8e0',
          400: '#41bcc9',
          500: '#1ba0b3',
          600: '#128094',
          700: '#126778',
          800: '#135464',
          900: '#154755',
          950: '#072c35',
        },
        // Accent — warm amber for highlights / risk
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral surface tokens (driven by CSS vars in index.css)
        surface: {
          bg: 'rgb(var(--surface-bg) / <alpha-value>)',
          card: 'rgb(var(--surface-card) / <alpha-value>)',
          subtle: 'rgb(var(--surface-subtle) / <alpha-value>)',
          hover: 'rgb(var(--surface-hover) / <alpha-value>)',
          border: 'rgb(var(--surface-border) / <alpha-value>)',
          'border-strong': 'rgb(var(--surface-border-strong) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          subtle: 'rgb(var(--ink-subtle) / <alpha-value>)',
          inverse: 'rgb(var(--ink-inverse) / <alpha-value>)',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)',
        card: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        pop: '0 8px 24px -8px rgb(0 0 0 / 0.12), 0 4px 8px -4px rgb(0 0 0 / 0.06)',
        glow: '0 0 0 1px rgb(27 160 179 / 0.18), 0 8px 24px -8px rgb(27 160 179 / 0.25)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        shimmer: 'shimmer 1.6s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
