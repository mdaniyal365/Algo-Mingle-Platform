/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'phone' : '400px',
      'tablet': '650px',
      'desktop' : '1024px'
    },
    extend: {
      fontFamily: {
        'primaryFont' : ['Montserrat'],
        'secondaryFont' : ['Signika Negative'],
        'lumanosimo' : ['Lumanosimo'],
        'poppins' : ['Poppins']
        
      }
    },
  },
  plugins: [],
}

