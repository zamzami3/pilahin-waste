module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B2545',
        secondary: '#134074',
        accent: '#13315C',
        softbase: '#F8F9FA',
        highlight: '#00B4D8',
        offwhite: '#F8F9FA',
        // Backward-compatible aliases to avoid breaking existing classes.
        'forest-emerald': '#0B2545',
        'eco-green': '#134074',
        'mint-soft': '#F8F9FA',
        'slate-gray': '#F8F9FA'
      }
    }
  },
  plugins: []
}
