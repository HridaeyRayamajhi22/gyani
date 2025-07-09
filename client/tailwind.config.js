/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        'section-height' : '500px',
      },
      maxWidth:{
        'course-card' : '424px',
      },
      boxShadow:{
        'custom-card': '0px 4px 15px 2px rgba(0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};
