/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue,md,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--pianeta-bg)',
        ink: 'var(--pianeta-text)',
        accent: 'var(--pianeta-accent)',
        highlight: 'var(--pianeta-highlight)',
        muted: 'var(--pianeta-muted)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pianeta: 'var(--r-md)',
      },
    },
  },
  plugins: [],
};
