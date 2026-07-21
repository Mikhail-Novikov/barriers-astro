export default {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,css,scss}',
  ],
  theme: {
    extend: {
      screens: {
        md: '768px',
      },
      container: {
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        maxWidth: false,
      },
      colors: {
        primary: '#E5E7EB',
        secondary: '#1F2937',
        accent: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
};
