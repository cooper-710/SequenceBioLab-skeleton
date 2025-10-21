/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface-2)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        silver: 'var(--color-silver)',
        danger: '#EF4444',
        warn: '#F59E0B',
        success: '#22C55E',
        info: '#3B82F6'
      },
      borderRadius: {
        md: '14px',
        lg: '20px',
        xl: '28px'
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.06)',
        DEFAULT: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 16px 40px rgba(0,0,0,0.18)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')]
}
