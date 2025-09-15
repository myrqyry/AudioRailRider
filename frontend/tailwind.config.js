/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    // Include all source files under src so Tailwind utility classes used in components are detected
    './src/**/*.{html,js,ts,jsx,tsx}',
    // Keep root-level globs for any top-level scripts or templates
    './*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
